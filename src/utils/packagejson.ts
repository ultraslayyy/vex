import path from 'node:path';
import fs from 'node:fs';

export async function updatePackageJson(pkg: string, version: string, depType: DepType) {
    const packageJsonPath = path.join(process.cwd(), 'package.json');

    let packageJson: PackageJson;
    if (fs.existsSync(packageJsonPath)) {
        packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    } else return;

    if (!packageJson[depType]) packageJson[depType] = {}

    packageJson[depType][pkg] = `^${version}`;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

export type DepType = 'dependencies' | 'devDependencies' | 'peerDependencies';

export interface PackageJson {
    name: string;
    version: string;
    license: string;
    dependencies?: {
        [dep: string]: string;
    }
    devDependencies?: {
        [devDep: string]: string;
    }
    bin?: {
        [bin: string]: string;
    }
    [entry: string]: any;
}

export const defaultPackageJson = (
    options: {
        name: string,
        version?: string,
        desc?: string,
        main?: string,
        script?: string,
        keywords?: string[],
        author?: string,
        license?: string,
        type?: 'commonjs' | 'module'
    }
) => `{
  "name": "${options.name}",
  "version": "${options.version ?? '1.0.0'}",
  "description": "${options.desc ?? ''}",
  "main": "${options.main ?? 'index.js'}",
  "scripts": {
    "test": "${options.script ?? 'No test script specified'}"
  },
  "keywords": [${options.keywords ?? ''}],
  "author": "${options.author ?? ''}",
  "license": "${options.license ?? 'ISC'}",
  "type": "${options.type ?? 'commonjs'}"
}`;