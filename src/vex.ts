import { cmdRef } from './utils/cmdList';

export default class Vex {
    #command: string | null = null;
    argv: string[] = [];

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

            return command.execute(args);
        } catch (err) {
            console.error(`Failed to execute command '${cmd}':`, err);
        }
    }
}