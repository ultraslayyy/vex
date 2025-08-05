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
        let data = {} as npmLockfile;
        let packagejson: PackageJson;

        if (fs.existsSync(LOCKFILE_PATH)) {
            data = JSON.parse(fs.readFileSync(LOCKFILE_PATH, 'utf-8'));
        }

        if (fs.existsSync('package.json')) {
            packagejson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
        } else return;

        Object.assign(data, {
           name: packagejson.name,
           version: version,
           lockfileVersion: 1
        });

        data.packages = {
            ...data.packages,
            "": {
                name: packagejson.name,
                version: packagejson.version,
                license: packagejson.license,
                dependencies: packagejson.dependencies,
                bin: packagejson.bin,
                devDependencies: packagejson.devDependencies
            }
        }

        data.packages[`node_modules/${pkg}`] = {
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

        fs.writeFileSync(LOCKFILE_PATH, JSON.stringify(data, null, 2));
    }
}

export interface npmLockfile {
    name?: string;
    version?: string;
    lockfileVersion: 1,
    packages?: {
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
            dependencies?: Record<string, string>;
            bin?: Record<string, string>;
            engines?: Record<string, string>;
            funding?: {
                type?: string;
                url: string;
            } | {
                type?: string;
                url: string;
            }[];
            optionalDependencies?: Record<string, string>;
            peerDependencies?: Record<string, string>;
            peerDependenciesMeta?: Record<string, {
                optional: boolean;
            }>;
        }
    }
}