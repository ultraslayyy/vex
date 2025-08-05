import Vex from '../cli';
import { commands } from './cmdList';

export default async function (vex: Vex, all?: boolean) {
    let allCommands;
    if (all) {
        allCommands = await usages(vex);
    } else {
        allCommands = commands.join(', ');
    }

    return `vex <command>
    
Usage:

vex help

All commands:
${allCommands}

vex@${(vex.constructor as typeof Vex).version}`;
}

async function usages(vex: Vex) {
    let cmds: [string, string][] = [];
    for (const c of commands) {
        const cmdModule = await Vex.cmd(c);
        if (cmdModule?.default) {
            const Command = cmdModule.default;
            const command = new Command(vex);
            const usage = command.constructor.usage;

            cmds.push([c, usage[0]]);
        }
    }

    const maxLength = Math.max(...cmds.map(([name]) => name.length));
    const lines = cmds.map(([name, desc]) => `${name.padEnd(maxLength + 8)}${desc}`);

    return lines.join('\n');
}