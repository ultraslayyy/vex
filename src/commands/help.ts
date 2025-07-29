import Command from '../cmd';
import { cmdRef } from '../utils/cmdList';

export default class help extends Command {
    static description = "Get help with vex and it's commands.";

    execute(args: string[]) {
        console.log('Default output'); // TODO: Return default help message. this.vex.defaultHelp; (most likely)
    }
}