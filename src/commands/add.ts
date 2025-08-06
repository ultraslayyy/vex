import Command, { Param } from '../cmd';
import { updatePackageJson } from '../utils/packagejson';
import { extractTarball } from '../utils/tar';
import { updateLockfile } from '../utils/lockFile';
import semver from 'semver';
import fs from 'fs-extra';
import path from 'node:path';

const REGISTRY_URL = 'https://registry.npmjs.org';
type DepType = 'dependencies' | 'devDependencies' | 'peerDependencies';
const installed = new Set<string>();

export default class add extends Command {
    static commandName = 'add';
    static description = 'Add a new package';
    static params: Param[] = [
        { name: 'packages', type: 'string', positional: true, required: true, description: 'Packages you want to add' },
        { name: 'dev', type: 'boolean', alias: 'D', description: 'Mark packages as devDependencies' },
        { name: 'peer', type: 'boolean', alias: 'p', description: '[OUT OF ORDER] Mark packages as peerDependencies' }
    ];
    static usage = ['vex add <packages>'];
    static customParams: boolean = true;

    async execute($global: Record<string, any>, $command: Record<string, any>, _: string[], customParams: string[] = []) {
        const pkgs = await this.#parseAddArgs(customParams);
        await this.#execute(pkgs, true);
    }

    async #execute(packages: Record<DepType, string[]>, isRoot: boolean = true) {
        const depTypes: DepType[] = ['dependencies', 'devDependencies', 'peerDependencies'];

        for (const depType of depTypes) {
            const pkgs = packages[depType];
            for (let i = 0; i < pkgs.length; i++) {
                let pkg = pkgs[i];
                let version = 'latest';

                if (pkg.indexOf('@npm:') !== -1) {
                    pkg = pkg.split('@npm:')[1];
                }

                if (pkg.startsWith('@')) {
                    const atIndex = pkg.indexOf('@', 1);
                    if (atIndex === -1) {
                        continue;
                    } else {
                        version = pkg.slice(atIndex + 1);
                        pkg = pkg.slice(0, atIndex);
                    }
                } else {
                    const atIndex = pkg.indexOf('@');
                    if (atIndex === -1) {
                        pkg = pkg;
                    } else {
                        version = pkg.slice(atIndex + 1);
                        pkg = pkg.slice(0, atIndex);
                    }
                }

                const installKey = `${pkg}@${version}`;
                if (installed.has(installKey)) return;
                installed.add(installKey);

                const metaRes = await fetch(`${REGISTRY_URL}/${pkg}`);
                if (!metaRes.ok) {
                    console.error(`Failed to fetch metadata for ${pkg}`);
                    return;
                }
                const metadata = await metaRes.json();

                let resolvedVersion: string;
                if (version === 'latest') {
                    resolvedVersion = metadata['dist-tags'].latest;
                } else if (metadata.versions[version]) {
                    resolvedVersion = version;
                } else {
                    const allVersions = Object.keys(metadata.versions);
                    const max = semver.maxSatisfying(allVersions, version);
                    if (!max) {
                        console.error(`No version found for ${pkg}@${version}`);
                        return;
                    }
                    resolvedVersion = max;
                }

                const versionMeta = metadata.versions[resolvedVersion];
                const tarballUrl = versionMeta.dist.tarball;

                const res = await fetch(tarballUrl);
                if (!res.ok) {
                    console.error(`Failed to fetch tarball for ${pkg}@${resolvedVersion}`);
                    return;
                }

                if (versionMeta.deprecated) {
                    console.warn(`Deprecation Warning: "${versionMeta.deprecated}" - ${pkg}@${resolvedVersion}`);
                }

                fs.ensureDir('node_modules');
                const extractPath = path.join('node_modules', ...pkg.split('/'));
                await fs.ensureDir(path.dirname(extractPath));
                await fs.ensureDir(extractPath);

                const buffer = Buffer.from(await res.arrayBuffer());
                await extractTarball(buffer, extractPath);

                updateLockfile(pkg, resolvedVersion, versionMeta);
                console.log('Installed:', `${pkg}@${resolvedVersion}`);

                if (isRoot) await updatePackageJson(pkg, resolvedVersion, depType);

                const deps = versionMeta.dependencies || {}

                if (Object.keys(deps).length > 0) {
                    await this.#execute(
                        {
                            dependencies: Object.entries(deps).map(([k, v]) => `${k}@${v}`),
                            devDependencies: [],
                            peerDependencies: []
                        },
                        false
                    );
                }
            }
        }
    }

    async #parseAddArgs(args: string[]) {
        const dependencies: Record<DepType, string[]> = {
            dependencies: [],
            devDependencies: [],
            peerDependencies: []
        }

        let current: DepType = 'dependencies';
        let depsUsed: DepType[] = [];

        for (const arg of args) {
            switch (arg) {
                case '--dev':
                case '-D':
                    current = 'devDependencies';
                    depsUsed.push('devDependencies');
                    break;
                case '--peer':
                case '-p':
                    current = 'peerDependencies';
                    depsUsed.push('peerDependencies');
                    break;
                case '--':
                    current = 'dependencies';
                    break;
                default: dependencies[current].push(arg);
            }
        }

        if (depsUsed.includes('devDependencies') && dependencies['devDependencies'].length === 0) {
            dependencies['devDependencies'] = dependencies['dependencies'];
            dependencies['dependencies'] = [];
        }

        return dependencies;
    }
}