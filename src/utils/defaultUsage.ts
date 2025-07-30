import Vex from '../vex';
import { commands } from './cmdList';

export default function (vex: Vex) {
    const allCommands = commands.join(', ');

    return `vex <command>
    
Usage:

vex add <foo>         add a dependency to your project
vex install           install all project dependencies
vex run <foo>         run the script named <foo>
vex <command> -h      help on <command>

All commands:
${allCommands}

vex@${(vex.constructor as typeof Vex).version}`
}