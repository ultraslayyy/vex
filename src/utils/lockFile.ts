import fs from 'node:fs';
import { PackageJson } from './packagejson';

const lockfilePaths = {
    vex: 'vex.lock.json',
    npm: 'package-lock.json'
}

export function updateLockfile(pkg: string, version: string, metadata: any, type: 'npm' | 'vex' = 'npm') {
    const LOCKFILE_PATH = lockfilePaths[type];

    if (type === 'vex') {
        return;
    } else {
        let data;
        let packagejson: PackageJson;

        if (fs.existsSync(LOCKFILE_PATH)) {
            data = JSON.parse(fs.readFileSync(LOCKFILE_PATH, 'utf-8'));
        }

        if (fs.existsSync('package.json')) {
            packagejson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
        } else return;

        let lockFile: npmLockfile = {
            name: packagejson.name,
            version: version,
            lockfileVersion: 1,
            packages: {
                "": {
                    name: packagejson.name,
                    version: packagejson.name,
                    license: packagejson.license,
                    dependencies: packagejson.dependencies,
                    bin: packagejson.bin,
                    devDependencies: packagejson.devDependencies
                }
            }
        }

        lockFile.packages[`node_modules/${pkg}`] = {
            version,
            resolved: metadata.dist.tarball,
            integrity: metadata.dist.integrity,
            cpu: metadata.cpu,
            license: metadata.license,
            dependencies: metadata.dependencies,
            bin: metadata.bin,
            engines: metadata.engines,
            funding: metadata.funding,
            optionalDependencies: metadata.optionalDependencies,
            peerDependencies: metadata.peerDependencies,
            peerDependenciesMeta: metadata.peerDependenciesMeta
        }

        fs.writeFileSync(LOCKFILE_PATH, JSON.stringify(lockFile, null, 2));
    }
}

export interface npmLockfile {
    name?: string;
    version?: string;
    lockfileVersion: 1,
    packages: {
        "": {
            name: string;
            version: string;
            license: string;
            dependencies?: {
                [dep: string]: string;
            },
            bin?: {
                [bin: string]: string;
            }
            devDependencies?: {
                [devDep: string]: string;
            }
        }
    } & {
        [pkg: `node_modules/${string}`]: {
            version: string;
            resolved: string;
            integrity: string;
            cpu?: string[];
            dev?: boolean;
            license: string;
            optional?: string;
            os?: string[];
            dependencies?: {
                [dep: string]: string;
            }
            bin?: {
                [bin: string]: string;
            }
            engines?: {
                [engine: string]: string;
            }
            funding?: {
                type?: string;
                url: string;
            }
            optionalDependencies?: {
                [optDep: string]: string;
            }
            peerDependencies?: {
                [peerDep: string]: string;
            }
            peerDependenciesMeta?: {
                [peerDepMeta: string]: {
                    optional: boolean;
                }
            }
        } | {
            version: string;
            resolved: string;
            integrity: string;
            cpu?: string[];
            dev?: boolean;
            funding?: {
                type?: string;
                url: string;
            }[];
            license: string;
            workspaces?: string[];
            optional?: boolean;
            os?: string[];
            dependencies?: {
                [dep: string]: string;
            }
            bin?: {
                [bin: string]: string;
            }
            engines?: {
                [engine: string]: string;
            }
            optionalDependencies?: {
                [optDep: string]: string;
            }
            peerDependencies?: {
                [peerDep: string]: string;
            }
            peerDependenciesMeta?: {
                [peerDepMeta: string]: {
                    optional: boolean;
                }
            }
        }
    }
}