import * as zlib from 'node:zlib';
import * as tarStream from 'tar-stream';
import { Readable } from 'node:stream';
import path from 'node:path';
import fs from 'fs-extra';

export async function extractTarball(buffer: Buffer, extractPath: string) {
    const gunzip = zlib.createGunzip();
    const extract = tarStream.extract();

    let rootPrefix = '';

    extract.on('entry', async (header, stream, next) => {
        if (!rootPrefix) {
            const parts = header.name.split('/');
            rootPrefix = parts[0] + '/';
        }

        if (!header.name.startsWith(rootPrefix)) {
            stream.resume();
            return next();
        }

        const strippedNamed = header.name.slice(rootPrefix.length);
        const filePath = path.join(extractPath, strippedNamed);

        if (header.type == 'directory') {
            await fs.ensureDir(filePath);
            stream.resume();
            return next();
        }

        await fs.ensureDir(path.dirname(filePath));
        const writeStream = fs.createWriteStream(filePath);

        stream.pipe(writeStream);
        stream.on('end', next);
        stream.resume();
    });

    Readable.from(buffer).pipe(gunzip).pipe(extract);

    return new Promise<void>((resolve, reject) => {
        extract.on('finish', resolve);
        extract.on('error', reject);
    });
}