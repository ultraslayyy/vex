#!/user/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cmdList_1 = require("./utils/cmdList");
const [, , command, args] = process.argv;
class Vex {
    constructor() {
    }
    getCmd(cmd) {
        const c = (0, cmdList_1.cmdRef)(cmd);
        if (!c)
            return; //! Log some kind of error here
        return c;
    }
    async executeCmd(cmd) {
        const command = this.getCmd(cmd);
    }
}
