'use strict';

import PathRoute from '../instance';
import fs from 'fs';
import http from 'http';

/**
 * @class FileJson
 * @classdesc Manage the json file, read and create as well
 */

// ------------------------------------------------------------------
// | [Types]
// ------------------------------------------------------------------

import { IFileStream_Download } from '../types';

// ------------------------------------------------------------------
// | [Class]
// ------------------------------------------------------------------

class FileStream {
    _route: PathRoute;
    _routeName: string;

    constructor(route: PathRoute) {
        this._route = route;
        this._routeName = '';
        return this;
    }

    /**
     * @description download item from web-url
     */

    async download({
        url,
        destination,
    }: IFileStream_Download): Promise<Boolean> {
        return new Promise((resolve, reject) => {
            const file = fs.createWriteStream(destination);
            http.get(url, (response) => {
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
}

// ------------------------------------------------------------------
// | [Export]
// ------------------------------------------------------------------

export default FileStream;
