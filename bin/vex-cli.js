#!/usr/bin/env node
try {
    const { enableCompileCache } = require('node:module');
    enableCompileCache?.();
} catch {}

try {
    const mod = require('../lib/vex.js');
    const Vex = mod.default || mod;

    const argv = process.argv.slice(2);
    const cmd = argv[0];
    const args = argv.slice(1);

    if (!cmd) {
        console.error('No command provided');
        process.exit(1);
    }

    const vex = new Vex({ argv: args });
    vex.execute(cmd, args).catch(err => {
        console.error('Error executing command:', err);
        process.exit(1);
    });
} catch (err) {
    console.error('Failed to start CLI:', err);
    process.exit(1);
}