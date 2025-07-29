"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Vex_instances, _a, _Vex_command, _Vex_execute;
Object.defineProperty(exports, "__esModule", { value: true });
const cmdList_1 = require("./utils/cmdList");
class Vex {
    static async getCmd(cmd) {
        const c = (0, cmdList_1.cmdRef)(cmd);
        if (!c) {
            console.error(`Unknown command '${cmd}'`);
            return null;
        }
        try {
            return await Promise.resolve(`${`./commands/${c}.js`}`).then(s => __importStar(require(s)));
        }
        catch (err) {
            console.error(`Failed to load command module './commands/${c}.js'`);
            return null;
        }
    }
    constructor({ argv = [] } = {}) {
        _Vex_instances.add(this);
        _Vex_command.set(this, null);
        this.argv = [];
        this.argv = argv;
    }
    async execute(cmd, args = this.argv) {
        if (!__classPrivateFieldGet(this, _Vex_command, "f")) {
            try {
                await __classPrivateFieldGet(this, _Vex_instances, "m", _Vex_execute).call(this, cmd, args);
            }
            catch (err) {
                console.error(err);
            }
        }
        else {
            return __classPrivateFieldGet(this, _Vex_instances, "m", _Vex_execute).call(this, cmd, args);
        }
    }
}
_a = Vex, _Vex_command = new WeakMap(), _Vex_instances = new WeakSet(), _Vex_execute = async function _Vex_execute(cmd, args) {
    try {
        const cmdModule = await _a.getCmd(cmd);
        if (!cmdModule?.default) {
            console.error(`Command '${cmd}' not found.`);
            return;
        }
        const Command = cmdModule.default;
        const command = new Command(this);
        return command.execute(args);
    }
    catch (err) {
        console.error(`Failed to execute command '${cmd}':`, err);
    }
};
exports.default = Vex;
