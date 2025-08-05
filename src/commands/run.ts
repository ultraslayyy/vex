import Command, { Param } from '../cmd';
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';

export default class run extends Command {
    static commandName: string = 'run';
    static description: string | null = 'Run a script';
    static params: Param[] = [
        { name: 'script', type: 'string', positional: true, required: true, description: 'The script to run' }
    ];
    static usage: string[] = ['vex run <script> [-- <args>]'];
    static customParams: boolean = true;

    async execute($global: Record<string, any>, $command: Record<string, any>, _: string[], argv: string[]) {
        const cwd = process.cwd();

        const [scriptName, ...rest] = argv;
        if (!scriptName) {
            console.error(this.help);
            process.exit(1);
        }

        const doubleDashIndex = rest.indexOf('--');
        const extraArgs = doubleDashIndex !== -1 ? rest.slice(doubleDashIndex + 1) : [];

        const pkg = this.#loadPackageJson(cwd);
        const scripts = pkg.scripts || {}
        const script = scripts[scriptName];

        if (!script) {
            console.error(`No script named "${scriptName}" found in package.json`);
            process.exit(1);
        }

        const fullCommand = [script, ...extraArgs].join(' ');

        const child = spawn(fullCommand, {
            cwd,
            shell: true,
            stdio: 'inherit',
            env: {
                ...process.env,
                PATH: this.#makePathWithLocalBins(cwd)
            }
        });

        ['SIGINT', 'SIGTERM', 'SIGHUP'].forEach(sig => {
            process.on(sig, () => {
                if (!child.killed) child.kill(sig as NodeJS.Signals);
            });
        });

        child.on('exit', (code, signal) => {
            if (signal) {
                process.kill(process.pid, signal);
            } else {
                process.exit(code ?? 0);
            }
        });

        child.on('error', err => {
            console.error('Failed to spawn script:', err);
            process.exit(1);
        });
    }

    #loadPackageJson(cwd: string) {
        const pkgPath = path.resolve(cwd, 'package.json');
        try {
            const raw = readFileSync(pkgPath, 'utf-8');
            return JSON.parse(raw);
        } catch (err) {
            console.error(`Failed to read package.json in ${cwd}:`, err instanceof Error ? err.message : String(err));
            process.exit(1);
        }
    }

    #makePathWithLocalBins(cwd: string) {
        const sep = process.platform === 'win32' ? ';' : ':';
        const localBin = path.join(cwd, 'node_modules', '.bin');
        const oldPath = process.env.PATH || '';
        return `${localBin}${sep}${oldPath}`;
    }
}