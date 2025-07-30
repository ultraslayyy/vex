import Command from './cmd';
import { cmdRef } from './utils/cmdList';
import defaultUsage from './utils/defaultUsage';
import packageFile from '../package.json';

export default class Vex {
    #command: Command | null = null;
    argv: string[] = [];

    static get version() {
        return packageFile.version;
    }

    static async getCmd(cmd: string) {
        const c = cmdRef(cmd);
        if (!c) {
            console.error(`Unknown command '${cmd}'`);
            return null;
        }
        try {
            return await import(`./commands/${c}.js`);
        } catch (err) {
            console.error(`Failed to load command module './commands/${c}.js'`);
            return null;
        }
    }

    constructor({ argv = [] } = {}) {
        this.argv = argv;
    }

    async execute(cmd: string, args = this.argv) {
        if (!this.#command) {
            try {
                await this.#execute(cmd, args);
            } catch (err) {
                console.error(err);
            }
        } else {
            return this.#execute(cmd, args);
        }
    }

    async #execute(cmd: string, args: string[]) {
        try {
            const cmdModule = await Vex.getCmd(cmd);
            if (!cmdModule?.default) {
                console.error(`Command '${cmd}' not found.`);
                return;
            }

            const Command = cmdModule.default;
            const command = new Command(this);

            if (!this.#command) this.#command = command;

            return command.execute(args);
        } catch (err) {
            console.error(`Failed to execute command '${cmd}':`, err);
        }
    }

    get command() {
        return this.#command?.name;
    }

    get usage() {
        return defaultUsage(this);
    }
}