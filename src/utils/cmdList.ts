export const commands = [
    'help'
];

export const aliases: { [c: string]: string } = {
    h: 'help'
}

export function cmdRef(cmd: string) {
    if (!cmd) return;

    if (commands.includes(cmd)) return cmd;
    if (aliases[cmd]) return aliases[cmd];
}