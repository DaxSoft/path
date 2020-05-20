'use strict';

/**
 * @class FileManager
 * @classdesc Manage the files of your routes
 */

// ------------------------------------------------------------------
// | [requirements]
// ------------------------------------------------------------------

import fs from 'fs';
import path from 'path';
import PathRoute from '../instance';

// ------------------------------------------------------------------
// | [Types]
// ------------------------------------------------------------------

interface FileManagerHistoricInterface {
    routeName: string;
    filename: string;
    field: string;
}

interface FileManagerControlFile {
    routeName?: string;
    filename: string;
    folder?: string | null;
    force?: boolean;
    data?: any;
}

interface FileManagerFiles {
    name: string;
    filename: string;
    filepath: string;
    extension: string;
    routeName: string;
}

interface FileManagerListFiles {
    routeName?: string;
    extension?: string | RegExp;
    options?: any;
}

interface FileManagerListFolders {
    name: string;
    path: string;
}

type FS_CONSTANTS_ACCESS = 'F_OK' | 'R_OK' | 'W_OK';

// ------------------------------------------------------------------
// | [FileManager]
// ------------------------------------------------------------------

class FileManager {
    _route: PathRoute;
    _routeName: string;
    _historic: Array<FileManagerHistoricInterface>;

    constructor(route: PathRoute) {
        this._route = route;
        this._routeName = '';
        this._historic = [];
        return this;
    }

    /**
     * @description defines a new default route
     * @param routeName the name of the new default route
     */

    setRoute(routeName: string): FileManager {
        this._routeName = routeName;
        return this;
    }

    /**
     * @description get all hiistoric' log
     */

    historic(): Array<FileManagerHistoricInterface> {
        return this._historic;
    }

    private setHistoric(
        routeName: string,
        filename: string,
        field: string
    ): FileManager {
        const newHistoric: FileManagerHistoricInterface = {
            routeName,
            filename,
            field,
        };

        this._historic.push(newHistoric);

        return this;
    }

    /**
     * @description Asynchronously uses 'fs.promises.access'
     * @param {String} filepath
     * @param {Array} [fsModes] Default is ['R_OK', 'F_OK']
     * uses like this ['F_OK', 'R_OK']
     * Rather than fs.constants.F_OK | fs.constants.R_OK
     * F_OK -> file exists
     * R_OK -> file is readable
     * W_OK -> file is writable
     * @see https://nodejs.org/dist/latest-v10.x/docs/api/fs.html#fs_fspromises_access_path_mode
     */

    async accessFile(
        filepath: string,
        fsModes: Array<FS_CONSTANTS_ACCESS> = ['R_OK', 'F_OK']
    ): Promise<Boolean> {
        const mode: number = fsModes
            .map((el) => fs.constants[el])
            .reduce((acc, cur) => cur | acc);

        return await new Promise<Boolean>(() => {
            fs.promises
                .access(filepath, mode)
                .then(() => true)
                .catch(() => false);
        });
    }

    /**
     * @description Asynchronously copy the file
     * @param {String} route to paste
     * @param {String} filepath to be copy
     * @returns {Boolean}
     */

    async copy(routeName: string, filepath: string): Promise<Boolean> {
        const fileExists = await this.accessFile(filepath);
        if (!fileExists) return false;
        await fs.promises.copyFile(
            filepath,
            this._route.plug(routeName, path.basename(filepath))
        );
        return true;
    }

    /**
     * @description Synchronously read the file and return his data
     * @param {String} [routeName] id of the route
     * @param {String} [filename] the name of the file to read
     * @param {String} [folder] if this is defined it will ignore the routeName
     * path
     * @returns {String}
     */

    readSync({
        routeName = this._routeName,
        filename,
        folder,
    }: FileManagerControlFile): string | undefined {
        if (!this._route.has(routeName) && !folder) return undefined;

        const filepath =
            typeof folder === 'string'
                ? path.join(folder, filename)
                : this._route.plug(routeName, filename);

        if (!fs.existsSync(filepath)) return undefined;
        this.setHistoric(routeName, filename, 'read');
        const content: string = fs.readFileSync(filepath, 'utf-8');
        return content;
    }

    /**
     * @description Asynchronously read the file and return his data
     * @param {String} [routeName] id of the route
     * @param {String} [filename] the name of the file to read
     * @returns {String}
     */

    async read({
        routeName = this._routeName,
        filename,
        folder,
    }: FileManagerControlFile): Promise<string | undefined> {
        if (!this._route.has(routeName) && !folder) return undefined;

        const filepath =
            typeof folder === 'string'
                ? path.join(folder, filename)
                : this._route.plug(routeName, filename);

        const isReadable: Boolean = await this.accessFile(filepath);

        if (!!isReadable) {
            this.setHistoric(routeName, filepath, 'read');
            const content: string = await fs.promises.readFile(
                filepath,
                'utf-8'
            );
            return content;
        }

        return undefined;
    }

    /**
     * @description Synchronously store/create a new file on the folder
     * @param {String} [routeName] if of the route
     * @param {String} [filename] the name of the file that will be created
     * @param {Boolean} [force=true] if it exists, then write over
     * @returns {Boolean}
     */

    storeSync({
        routeName = this._routeName,
        filename,
        force = true,
        data,
    }: FileManagerControlFile): Boolean {
        if (!this._route.has(routeName)) return false;

        const filepath: string = this._route.plug(routeName, filename);
        const fileExists: Boolean = fs.existsSync(filepath);
        if (fileExists && !force) return true;

        fs.writeFileSync(filepath, data, 'utf-8');
        this.setHistoric(routeName, filepath, 'write');
        return true;
    }

    /**
     * @description Asynchronously store/create a new file on the folder
     * @param {String} [routeName] if of the route
     * @param {String} [filename] the name of the file that will be created
     * @param {Boolean} [force=true] if it exists, then write over
     * @returns {Boolean}
     */

    async store({
        routeName = this._routeName,
        filename,
        force = true,
        data,
    }: FileManagerControlFile): Promise<Boolean> {
        if (!this._route.has(routeName)) return false;

        const filepath: string = this._route.plug(routeName, filename);
        const itExists: Boolean = await this.accessFile(filepath);

        if (itExists && !force) return true;
        await fs.promises.writeFile(filepath, data, 'utf-8');
        this.setHistoric(routeName, filename, 'write');

        return true;
    }

    /**
     * @description Synchronously delete an file
     * @param {String} [routeName] if of the route
     * @param {String} [filename] the name of the file that will be created
     * @returns {Boolean}
     */

    removeSync({
        routeName = this._routeName,
        filename,
    }: FileManagerControlFile): Boolean {
        if (!this._route.has(routeName)) return false;
        const filepath = this._route.plug(routeName, filename);
        if (!fs.existsSync(filepath)) {
            return true;
        }
        fs.unlinkSync(filepath);
        this.setHistoric(routeName, filename, 'remove');
        return true;
    }

    /**
     * @description Asynchronously delete an file
     * @param {String} [routeName] if of the route
     * @param {String} [filename] the name of the file that will be created
     */

    async remove({
        routeName = this._routeName,
        filename,
    }: FileManagerControlFile): Promise<Boolean> {
        if (!this._route.has(routeName)) return false;
        const filepath = this._route.plug(routeName, filename);
        const itExists = await this.accessFile(filepath);
        if (!itExists) return true;
        fs.promises.unlink(filepath);
        this.setHistoric(routeName, filename, 'remove');
        return true;
    }

    /**
     * @description return all files inside of the route
     * @param {String} routeName this need to be registred on route
     * @param {String} [extension=undefined] if you want to filter the files
     * by extensions.
     * @example
     * Route.Example.files('src')
     * Route.Example.files('src', 'json')
     * Route.Example.files('src', 'json|js')
     * @returns {Array} each element on this <array> will be a <object> with
     * the follow pattern:
     * {
     *  name: name of the file,
     *  filename: name of the file with extension,
     *  path: path to file,
     *  extension: extension of the file
     * }
     */

    async files({
        routeName = this._routeName,
        extension,
        options,
    }: FileManagerListFiles): Promise<Array<FileManagerFiles> | Array<[]>> {
        // checkout
        if (!this._route.has(routeName)) return [];
        const route = this._route.get(routeName);
        const filepath: string = route.filepath;
        const itExists = await this.accessFile(filepath);
        if (!itExists) return [];

        // extension?
        if (!!extension && typeof extension === 'string') {
            extension = new RegExp(`\.(${extension})$`, 'gi');
        }

        // stocker
        const stock: Array<FileManagerFiles> = [];

        // get the files;
        const files = await fs.promises.readdir(filepath, options);

        await Promise.all(
            files.map(async (file) => {
                const _fpath = path.join(filepath, file);
                const status = await fs.promises.lstat(filepath);

                // is directory?
                if (!status.isDirectory()) {
                    let fname = _fpath.replace(/^.*[\\\/]/, '');
                    let ext = path.extname(fname);

                    // extension?
                    if (extension && !fname.match(extension)) {
                        return;
                    }

                    stock.push({
                        name: fname.replace(ext, ''),
                        filename: fname,
                        filepath: _fpath,
                        extension: ext,
                        routeName: route.name,
                    });
                }
            })
        );

        return stock;
    }

    /**
     * @description return all directories of the route
     * @param {String} routeName this need to be registred on route
     * @param {RegExp} [filter=undefined] this is a regexp
     * @example
     * Route.Example.folders('home')
     * Route.Example.folders('home', /^\a/gi)
     * @return {Array} each element on this <array> will be a <object> with
     * the follow pattern:
     * {
     *  name: name of the folder,
     *  path: path to folder,
     * }
     */

    async folders(
        routeName = this._routeName
    ): Promise<Array<FileManagerListFolders> | Array<[]>> {
        if (!this._route.has(routeName)) return [];
        const route = this._route.get(routeName);

        const isDirectory = (source) => fs.lstatSync(source).isDirectory();

        let directories = await fs.promises.readdir(route.filepath);
        directories = directories
            .map((name) => path.join(route.filepath, name))
            .filter(isDirectory);

        const stock: Array<FileManagerListFolders> = [];

        directories.map((source) => {
            const name = source.replace(/^.*[\\\/]/, '');
            stock.push({
                name,
                path: source,
            });
        });

        return stock;
    }

    /**
     * @description check out if have the file on the folder
     * @param {String} routeName
     * @param {String} folderName
     * @returns {Object|undefined}
     */

    hasFolder(routeName: string, folderName: string): Boolean {
        if (!this._route.has(routeName)) return false;
        const filepath = path.join(
            this._route.get(routeName).filepath,
            folderName
        );
        return (
            !!fs.existsSync(filepath) && fs.lstatSync(filepath).isDirectory()
        );
    }

    /**
     * @description create a new folder if it doesn't exist
     * @param {String} routeName
     * @param {String} folderName
     */

    setFolder(routeName: string, folderName: string): FileManager {
        const filepath = path.join(
            this._route.get(routeName).filepath,
            folderName
        );
        if (!this.hasFolder(routeName, folderName)) {
            fs.mkdirSync(filepath, {
                recursive: false,
            });
        }
        return this;
    }
}

// ------------------------------------------------------------------
// | [exports]
// ------------------------------------------------------------------

export default FileManager;
