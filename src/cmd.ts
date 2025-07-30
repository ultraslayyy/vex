import Vex from './vex';

export default class Command {
    static description: string | null = null;
    static params: string[] = [];
    static usage: string[];
    vex: Vex;

    constructor(vex: Vex) {
        this.vex = vex;
    }

    get name() {
        return this.constructor.name;
    }

    get description() {
        return (this.constructor as typeof Command).description;
    }

    get params() {
        return (this.constructor as typeof Command).params;
    }

    get usage() {
        return (this.constructor as typeof Command).usage;
    }
}