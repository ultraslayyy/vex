const commands = [
    'add',
    'help',
    'init',
    'install',
    'remove',
    'run'
];

const aliases: { [a: string]: string } = {
    // Shorthand commands
    a: 'add',
    h: 'help',
    i: 'install',
    r: 'run',

    // typos because why tf not
    hel: 'help',
    hell: 'help',
    hlep: 'help',
    
    innit: 'init',
    in: 'install',
    ins: 'install',
    inst: 'install',
    insta: 'install',
    instal: 'install',
    isnt: 'install',
    isnta: 'install',
    isntal: 'install',
    isntall: 'install',
}

export function cmdRef(cmd: string) {
    if (!cmd) return;

    if (commands.includes(cmd)) return cmd;
    if (aliases[cmd]) return aliases[cmd];
}