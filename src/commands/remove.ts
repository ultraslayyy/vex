import Command, { Param } from '../cmd';
import fs from 'fs-extra';
import path from 'node:path';

export default class remove extends Command {
    static commandName: string = 'remove';
    static description: string | null = 'Remove a package';
    static params: Param[] = [
        { name: 'package', type: 'string', positional: true, required: true, description: 'The package you want to remove' }
    ];
    static usage: string[] = ['vex remove <package>'];

    async execute($global: Record<string, any>, $command: Record<string, any>, _: string[]) {
        const packageName = $command.command;
        const isScoped = $command.command.startsWith('@');
        const packagePath = isScoped ? path.join('node_modules', ...$command.command.split('/')) : path.join('node_modules', $command.command);
        
        try {
            await fs.remove(packagePath);
            
            const packageJson = await fs.readJson('package.json');
            const sections = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
            let updatedPackageJson = false;

            for (const section of sections) {
                if (packageJson[section] && packageJson[section][packageName]) {
                    delete packageJson[section][packageName];
                    updatedPackageJson = true;
                }
            }

            if (updatedPackageJson) {
                await fs.writeJson('package.json', packageJson, { spaces: 2 });
            }

            if (await fs.pathExists('package-lock.json')) {
                const lockJson = await fs.readJson('package-lock.json');
                if (lockJson[packageName]) {
                    delete lockJson[packageName];
                    await fs.writeJson('package-lock.json', lockJson, { spaces: 2});
                }
            }

            console.log(`Removed ${packageName}`);
        } catch (err) {
            console.error(`Failed to removed ${packageName}:`, err);
        }
    }
}