#!/user/bin/env node
import { cmdRef } from './utils/cmdList';

const [, , command, args] = process.argv;

export default class Vex {
    constructor() {

    }

    static getCmd(cmd: string) {
        const c = cmdRef(cmd);
        if (!c) return; //! Log some kind of error here
        return c;
    }

    static async executeCmd(cmd: string) {
        const command = this.getCmd(cmd);
    }

    async execute(cmd: string, args = process.argv) {

    }
}