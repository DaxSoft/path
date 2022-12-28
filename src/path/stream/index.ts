import PathRoute from '..';
import { PathStreamManagerStructure } from '../../types/stream';
import fs from 'node:fs';
import http from 'node:http';
import https from 'node:https';

export default class PathStreamManager implements PathStreamManagerStructure {
    _route: PathRoute;

    constructor(pr: PathRoute) {
        this._route = pr;
    }

    /**
     * @description download item from web-url
     */
    async download(
        url: string,
        destination: string,
        protocol: 'http' | 'https'
    ): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const file = fs.createWriteStream(destination);
            const method = protocol === 'http' ? http : https;
            method.get(url, (response) => {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve(true);
                }).on('error', () => {
                    fs.unlinkSync(destination);
                    reject(false);
                });
            });
        });
    }

    /**
     * @description read a file by 'chunking'
     */
    async read(
        filepath: string,
        onData?:
            | ((chunk: string | Buffer, data: string | Buffer) => void)
            | undefined
    ): Promise<string | undefined> {
        return new Promise((resolve, reject) => {
            const readStream = fs.createReadStream(filepath, {
                encoding: 'utf-8',
            });
            let data = '';
            readStream
                .on('data', function (chunk) {
                    data += chunk.toString();
                    onData && onData(chunk, data);
                })
                .on('end', function () {
                    resolve(data);
                })
                .on('error', function () {
                    reject(undefined);
                });
        });
    }

    /**
     * @description write a new file using streams
     */

    async write(filepath: string, data: any): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const writeStream = fs.createWriteStream(filepath, {
                encoding: 'utf-8',
            });
            writeStream.write(data);
            writeStream.end();
            writeStream.on('finish', () => resolve(true)).on('error', reject);
        });
    }
}
