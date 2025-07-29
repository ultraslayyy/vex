"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cmd_1 = __importDefault(require("../cmd"));
class help extends cmd_1.default {
    execute(args) {
        console.log('Default output'); // TODO: Return default help message. this.vex.defaultHelp; (most likely)
    }
}
help.description = "Get help with vex and it's commands.";
exports.default = help;
