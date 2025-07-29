"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aliases = exports.commands = void 0;
exports.cmdRef = cmdRef;
exports.commands = [
    'help'
];
exports.aliases = {
    h: 'help'
};
function cmdRef(cmd) {
    if (!cmd)
        return;
    if (exports.commands.includes(cmd))
        return cmd;
    if (exports.aliases[cmd])
        return exports.aliases[cmd];
}
