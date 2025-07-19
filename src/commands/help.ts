export function help(command?: string | undefined) {
    if (!command) {
        console.log(`
vex - Experimental Package Manager (v0.0.1)

Usage:
  vex install              Install dependencies
  vex add <package>        Add a new package
  vex remove <package>     Removes a package
  vex init [-y|--yes]      Creates a new package.json
  vex help                 Show help
        `);
    } else {
        console.log(`No current help for ${command}`);
    }
}