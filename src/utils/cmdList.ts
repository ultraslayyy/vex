export const commands: string[] = [
    'add',
    'help',
    'init',
    'install',
    'remove',
    'run'
];

export const aliases: { [a: string]: string } = {
    a: 'add',
    h: 'help',
    i: 'install',
    r: 'run'
}

export function cmdRef(cmd: string) {
    if (commands.includes(cmd)) return cmd;
    if (aliases[cmd]) return aliases[cmd];
}