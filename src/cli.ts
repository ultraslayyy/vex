import { cmdRef } from './utils/cmdList';
import { parseCmdArgs } from './utils/parseArgs';
import packageFile from '../package.json';
import defaultHelp from './utils/defaultHelp';

export default class Vex {
    argv: string[] = [];

    constructor({ argv = [] } = {}) {
        this.argv = argv;
    }

    static async cmd(cmd: string) {
        const c = cmdRef(cmd);
        if (!c) {
            console.error(`Unknown command '${cmd}'`);
            return null;
        }
        try {
            return await import(`./commands/${c}.js`);
        } catch (err) {
            console.error(`Failed to load command module: './commands/${c}.js'`);
            return null;
        }
    }

    async execute(cmd: string, args = this.argv) {
        try {
            const cmdModule = await Vex.cmd(cmd);
            if (!cmdModule?.default) {
                console.error(`Command '${cmd}' not found.`);
                return;
            }

            const Command = cmdModule.default;
            const command = new Command(this);

            const parsed = parseCmdArgs(args, Command.params);

            if (parsed?.$global.help) {
                await this.execute('help', [cmdRef(cmd) ?? '']);
                return;
            }

            if (command.customParams) {
                try {
                    await command.execute({}, {}, [], args);
                } catch (err) {
                    console.error(err instanceof Error ? err.message : String(err));
                }
                return;
            }

            await command.execute(parsed?.$global, parsed?.$global, parsed?._);
        } catch (err) {
            console.error(err instanceof Error ? err.message : String(err));
        }
    }

    static get version() {
        return packageFile.version;
    }

    get usage() {
        return defaultHelp(this);
    }
}