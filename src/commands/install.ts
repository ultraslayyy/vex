import Command, { Param } from '../cmd';
import fs from 'fs-extra';
import path from 'node:path';
import { extractTarball } from '../utils/tar';

export default class install extends Command {
    static commandName: string = 'install';
    static description: string | null = 'Install dependencies';
    static params: Param[] = [
        { name: 'lock', type: 'boolean', alias: 'l', description: 'Use the lock file for installing packages. Similar to "npm clean-install"' }
    ];
    static usage: string[] = ['vex install'];

    async execute($global: Record<string, any>, $command: Record<string, any>, _: string[]) {
        let pkgs = [];
        
        if ($command.lock) {
            if (!fs.existsSync('package-lock.json')) {
                console.error('No package-lock.json file found');
                process.exit(1);
            }

            const lock = JSON.parse(fs.readFileSync('package-lock.json', 'utf-8'));
            pkgs = Object.entries(lock) as [string, { version: string, resolved: string }][];
        } else {
            //! We'll do package.json reading later. I don't feel like it rn
            await this.execute($global, { 'lock': true }, _);
            return;
        }

        if (pkgs.length === 0) {
            console.log('Nothing to install.');
            return;
        }

        await fs.ensureDir('node_modules');

        for (const [pkg, meta] of pkgs) {
            const extractPath = path.join('node_modules', pkg);

            const res = await fetch(meta.resolved);
            if (!res.ok || !res.body) {
                console.error(`Failed to fetch ${pkg}@${meta.version}`);
                continue;
            }

            const buffer = Buffer.from(await res.arrayBuffer());
            await extractTarball(buffer, extractPath);

            console.log(`Installed ${pkg}@${meta.version}`);
        }

        console.log('All packages installed');
    }
}