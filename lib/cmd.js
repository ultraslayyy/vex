"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Command {
    constructor(vex) {
        this.vex = vex;
    }
    get name() {
        return this.constructor.name;
    }
    get description() {
        return this.constructor.description;
    }
    get params() {
        return this.constructor.params;
    }
}
Command.description = null;
Command.params = [];
exports.default = Command;
