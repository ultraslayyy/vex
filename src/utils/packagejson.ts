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