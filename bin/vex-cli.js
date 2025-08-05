#!/usr/bin/env node
try {
    const { enableCompileCache } = require('node:module');
    enableCompileCache?.();
} catch {}

const Vex = require('../lib/cli.js');

(async () => {
    const argv = process.argv.slice(2);
    const vex = new Vex.default({ argv });

    if (argv.length === 0) {
        await vex.execute('help');
        return;
    }

    const cmd = argv[0];
    const args = argv.slice(1);

    await vex.execute(cmd, args);
})();