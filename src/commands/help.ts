import Command from '../cmd';
import { cmdRef } from '../utils/cmdList';

export class help extends Command {
    static description = "Get help with vex and it's commands.";

    execute(args: string[]) {
        return ''; // TODO: Return default help message. this.vex.defaultHelp; (most likely)
    }
}