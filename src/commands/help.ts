import Command, { Param } from '../cmd';
import Vex from '../cli';
import defaultHelp from '../utils/defaultHelp';

export default class help extends Command {
    static commandName = 'help';
    static description = 'Show help';
    static params: Param[] = [
        { name: 'command', type: 'string', positional: true, description: 'Show help for a command. Equivalent to "vex <command> -h"' },
        { name: 'all', type: 'boolean', alias: 'a', description: 'Show usages for all commands' }
    ];
    static usage = ['vex help [<command>]'];

    async execute($global: Record<string, any>, $command: Record<string, any>, _: string[]) {
        if (!_[0]) {
            if ($command.all) {
                return console.log(await defaultHelp(this.vex, true));
            }

            return console.log(await this.vex.usage);
        }

        try {
            const cmdModule = await Vex.cmd(_[0]);
            if (!cmdModule?.default) {
                console.error(`Command '${_[0]}' not found`);
                return;
            }

            const Command = cmdModule.default;
            const command = new Command(this.vex);

            console.log(command.help);
        } catch (err) {
            console.error(err instanceof Error ? err.message : String(err));
        }
    }
}