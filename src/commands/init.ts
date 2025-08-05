import Command, { Param } from '../cmd';
import path from 'node:path';
import fs from 'node:fs';
import readline from 'readline';
import { defaultPackageJson } from '../utils/packagejson';

export default class init extends Command {
    static commandName = 'init';
    static description = 'Creates a new package.json';
    static params: Param[] = [
        { name: 'yes', type: 'boolean', alias: 'y', description: 'Accept all default values' },
        { name: 'force', type: 'boolean', alias: 'f', description: 'Forces an override of current package.json if found' }
    ];
    static usage: string[] = ['vex init'];

    async execute($global: Record<string, any>, $command: Record<string, any>, _: string[]) {
        let force = $command.force ?? false;
        if (fs.existsSync('package.json') && !force) {
            console.warn('A package.json already exists at this location');
            const userChoice = await this.#multipleChoice(['Cancel', 'Override'], 'Do you wish to override the existing package.json?');

            if (userChoice === 'Override') {
                force = true;
            } else return;
        }

        const dirName = path.basename(process.cwd());
        let json;

        if ($command.yes) {
            const obj = JSON.parse(defaultPackageJson({ name: dirName.toLowerCase() }));
            json = JSON.stringify(obj, null, 2);
        } else {
           const name = await this.#askQuestion('Package name', dirName);
            const version = await this.#askQuestion('Version', '1.0.0');
            const desc = await this.#askQuestion('Description');
            const main = await this.#askQuestion('Entry point', 'index.js');
            const script = await this.#askQuestion('Test script');
            const keywordsTemp = await this.#askQuestion('Keywords', 'comma separated');
            const keywords = keywordsTemp.split(',').map(s => s.trim()).filter(s => s.length > 0);
            const author = await this.#askQuestion('Author');
            const license = await this.#askQuestion('License', 'ISC');
            const moduleType = await this.#multipleChoice(['commonjs', 'module'], 'Type: ');

            const obj = JSON.parse(defaultPackageJson({
                name: name.toLowerCase(),
                version,
                desc,
                main,
                script,
                keywords,
                author,
                license,
                type: moduleType as 'module' | 'commonjs'
            }));
            json = JSON.stringify(obj, null, 2);
        }

        fs.writeFileSync('package.json', json);
        console.log(`Successfully ${force ? 'Overid' : 'Created'} package.json`);
        console.log(json);
    }

    async #askQuestion(query: string, defaultValue?: string): Promise<string> {
        const grey = (text: string) => `\x1b[90m${text}\x1b[0m`;

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const fullPrompt = defaultValue ? `${query} ${grey(`(${defaultValue})`)}` : `${query}:`;

        return new Promise(resolve => {
            rl.question(fullPrompt, answer => {
                rl.close();
                resolve(answer.trim() || (defaultValue === 'comma separated' ? undefined : defaultValue) || '');
            });
        });
    }

    async #multipleChoice(options: string[], question: string): Promise<string> {
        const grey = (text: string) => `\x1b[90m${text}\x1b[0m`;
        const helpText = `${grey(`(Use Up & Down to select, Space or Enter to confirm)`)}`;

        return new Promise(resolve => {
            let selected = 0;

            const clearLine = () => process.stdout.write('\x1b[2K');
            const moveUp = (n = 1) => process.stdout.write(`\x1b[${n}A`);

            const render = () => {
                moveUp(options.length + 1);
                clearLine();
                console.log(question);
                for (let i = 0; i < options.length; i++) {
                    clearLine();
                    const prefix = selected === i ? '\x1b[36m> \x1b[0m' : '  ';
                    console.log(`${prefix}${options[i]}`);
                }
            };

            const handleKeyPress = (chunk: Buffer) => {
                const key = chunk.toString();

                if (chunk[0] === 3) process.exit();

                if (key === '\u001b[A') {
                    selected = (selected - 1 + options.length) % options.length;
                    render();
                } else if (key === '\u001b[B') {
                    selected = (selected + 1) % options.length;
                    render();
                } else if (key === ' ' || key === '\r') {
                    process.stdin.setRawMode(false);
                    process.stdin.pause();
                    process.stdin.removeListener('data', handleKeyPress);
                    console.log();
                    resolve(options[selected]);
                }
            };

            console.log(question);
            options.forEach((opt, i) => {
                const prefix = selected === i ? '\x1b[36m> \x1b[0m' : '  ';
                console.log(`${prefix}${opt}`);
            });

            process.stdin.setRawMode(true);
            process.stdin.resume();
            process.stdin.on('data', handleKeyPress);
        });
    }
}