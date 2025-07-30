import Command from '../cmd';
import Vex from '../vex';

export default class help extends Command {
    static description = "Get help with vex and its commands.";

    async execute(args: string[]) {
        if (!args.length) {
            console.log(this.vex.usage);
        }

        if (args.length >= 1) {
            this.#searchCmd(args[0]);
        }
    }

    async #searchCmd(cmd: string) {
        
    }
}