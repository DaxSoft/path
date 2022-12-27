/*
:--------------------------------------------------------------------------
: [instance]
:--------------------------------------------------------------------------
:
:   This contents is the structure of the Instance of each Routes.
*/

import path from 'node:path';
import fs from 'node:fs';
import { sanitizeFilepath } from '../utils/regex';
import {
    FilesDataContext,
    FolderDataContext,
    PathHierarchyContext,
    PathRouteStructure,
    RoutesDataContext,
} from '../types';
import PathFileManager from './io';
import PathJsonManager from './json';
import PathStreamManager from './stream';

export default class PathRoute implements PathRouteStructure {
    #routes: RoutesDataContext[] = [];
    #io: PathFileManager;
    #json: PathJsonManager;
    #stream: PathStreamManager;

    constructor() {
        this.#io = new PathFileManager(this);
        this.#json = new PathJsonManager(this);
        this.#stream = new PathStreamManager(this);
    }

    /**
     * @description access the JsonManager
     * @returns {PathFileManager}
     */
    stream(): PathStreamManager {
        return this.#stream;
    }

    /**
     * @description access the JsonManager
     * @returns {PathFileManager}
     */
    json(): PathJsonManager {
        return this.#json;
    }

    /**
     * @description access the FileManager
     * @returns {PathFileManager}
     */
    io(): PathFileManager {
        return this.#io;
    }

    /**
     * @description returns the list of all routes created
     * @returns {RoutesDataContext[]}
     */
    routes(): RoutesDataContext[] {
        return this.#routes;
    }

    /**
     * @description returns the total amount of routes
     * @returns {Number}
     */
    size(): number {
        return this.#routes.length;
    }

    /**
     * @description creates a new route if it don't exists
     * @param {RoutesDataContext} context
     * @returns {PathRoute}
     */
    add(routeName, routePath): PathRoute {
        const isNew = !this.has(routeName);
        if (isNew) {
            this.#routes.push({
                routeName,
                routePath,
            });
        }
        return this;
    }

    /**
     * @description edits a routePath from a route
     * @param routeName
     */
    edit(routeName: string, routePath: string): PathRoute {
        const rt = this.#routes.findIndex((d) => d.routeName === routeName);
        if (rt) {
            this.#routes[rt] = {
                routeName,
                routePath,
            };
        }
        return this;
    }

    /**
     * @desc checks if a route exists
     * @param routeName
     * @returns {boolean}
     */

    has(routeName: string): boolean {
        return !!this.get(routeName);
    }

    /**
     * @desc get the route by his name or returns undefined if not found
     * @param routeName
     * @returns {RoutesDataContext | undefined}
     */
    get(routeName: string): RoutesDataContext | undefined {
        const route = this.#routes.find(
            (route) => route.routeName === routeName
        );
        return route;
    }

    /**
     * @desc removes a route if it exists
     * @param routeName
     * @returns {PathRoute}
     */
    remove(routeName: string): PathRoute {
        this.#routes = [
            ...this.#routes.filter((r) => r.routeName !== routeName),
        ];
        return this;
    }

    /**
     * @description create an alias from a existing route and returns a new one
     * @param {String} aliasRouteName
     * @param {String} routeName
     * @returns {PathRoute}
     * @example
     * instance.add('x', './')
     * instance.alias('y', 'x')
     * instance.get('y')?.routePath === './'
     */
    alias(aliasRouteName: string, routeName: string): PathRoute {
        const route = this.get(routeName);
        const hasAliasRoute = this.has(aliasRouteName);

        if (!hasAliasRoute && !!route) {
            this.add(aliasRouteName, route.routePath);
        }
        return this;
    }

    /**
     * @description creates a new route following another route as base;
     * it will join the routePath with the base
     * @param props
     * @returns {PathRoute}
     * @example
     * instance.add('x', './')
     * instance.join('j', 'x')
     * instance.get('j').routePath === './j'
     * # or
     * instance.join('j', 'x', 'example')
     * instance.get('j').routePath === './example'
     */
    join(
        newRouteName: string,
        referenceRouteName: string,
        filepath?: string | undefined
    ): PathRoute {
        const route = this.get(referenceRouteName);

        if (!!route) {
            this.add(
                newRouteName,
                path.join(route.routePath, filepath || newRouteName)
            );
        }

        return this;
    }

    /**
     * @description Uses the method path.join with an existing route
     * @param {String} routeName
     * @param {String} filepath
     * @returns {String|undefined}
     */
    plug(routeName: string, filepath: string): string | undefined {
        const route = this.get(routeName);
        if (!route) return undefined;
        return path.join(route.routePath, filepath);
    }

    /**
     * @description Sanitizes the slides of the filepath
     * @param routeName
     * @returns {String|undefined}
     */

    sanitize(routeName: string): string | undefined {
        const route = this.get(routeName);
        return route ? sanitizeFilepath(route.routePath) : undefined;
    }

    /**
     * @description get the last folder/filename
     * @param filepath
     */
    endsWith(filepath: string): string {
        const str = sanitizeFilepath(filepath);
        return path.basename(str);
    }

    /**
     * @description go backward in the folder path using path.resolve with '../'
     * @param routeName
     * @param level
     */
    backward(routeName: string, level: number = 1): string | undefined {
        const route = this.get(routeName);
        if (route) {
            const predPath = new Array(level).fill('..');
            return path.resolve(route.routePath, ...predPath);
        }
        return undefined;
    }

    /**
     * @description Slices the path toward an subfolder.
     * Example, I have a routeName (path) like this:
     *  routeName: health/clients =>  ../server/data/health/clients;
     * Then, I want to get the path only to 'data'. So I do:
     * instance.towards('../server/data/health/clients', to: 'data')
     * So, I will get: ../server/data
     * @param {String} filepath
     * @param {String} to
     * @param {Boolean} strict if it is true, will compare as '==='; if false,
     * will use Regexp with the flgas 'giu'
     * @example
     * instance.towards('../server/data/health/clients', to: 'data')
     */
    towards(
        filepath: string,
        to: string,
        strict?: boolean | undefined
    ): string | undefined {
        try {
            let splitPaths = filepath.split(/(\/|\\)/gimu);
            const paths: string[] = [];
            const totalLength = splitPaths.length;
            for (let index = 0; index < totalLength; index++) {
                const element = splitPaths[index];
                paths.push(element);
                if (!!strict) {
                    if (element === to) {
                        break;
                    }
                } else {
                    let rule = new RegExp(`(${to})`, 'giu');
                    if (rule.test(element)) {
                        break;
                    }
                }
            }
            return path.join(...paths);
        } catch (error) {
            return undefined;
        }
    }

    /**
     * @description get the hierarchy structure of the subfolders
     * @param {String} routeName
     */

    hierarchy(routeName: string): Record<string, PathHierarchyContext> {
        const paths: Record<string, PathHierarchyContext> = {};
        const route = this.get(routeName);
        if (!route) return paths;

        const { routePath: filepath } = route;
        let splitPaths = filepath.replace(/(\/|\/\/|\\|\\\\)/g, ' ').split(' ');
        splitPaths.map((current, currentIndex, array) => {
            let previous = array[currentIndex - 1];

            const index = array.length - currentIndex;

            paths[current] = {
                path: this.backward(routeName, index),
                index,
                next: '',
                parent: '',
                current,
            };
            if (paths.hasOwnProperty(previous)) {
                paths[current].parent = previous;
                paths[previous].next = current;
            }
        });

        return paths;
    }

    /**
     * @description Alias for 'path.resolve'
     * @param {String} [paths]
     */
    resolve(...paths: string[]): string {
        return path.resolve(...paths);
    }

    /**
     * @description Alias for 'path.basename'
     * @param {String} [paths]
     */
    basename(filepath: string, ext: string): string {
        return path.basename(filepath, ext);
    }

    /**
     * @description Alias for 'path.dirname'
     * @param {String} [paths]
     */

    dirname(filepath: string): string {
        return path.dirname(filepath);
    }

    /**
     * @description return all files inside of the route
     * @param {String} routeName this need to be registred on route
     * @param {String} [extension=undefined] if you want to filter the files
     * by extensions.
     * @example
     * instance.files('src')
     * instance.files('src', 'json')
     * instance.files('src', 'json|js')
     * @returns {Array} each element on this <array> will be a <object> with
     * the follow pattern:
     * {
     *  name: name of the file,
     *  filename: name of the file with extension,
     *  path: path to file,
     *  extension: extension of the file
     * }
     */
    async files(
        routeName: string,
        extension = undefined
    ): Promise<FilesDataContext[]> {
        const data: FilesDataContext[] = [];

        const route = this.get(routeName);
        if (!route) return data;

        const exists = this.#io.exists(route.routePath);
        if (!exists) return data;

        const files = await fs.promises.readdir(route.routePath, {
            encoding: 'utf-8',
        });

        files.map((file) => {
            const _fpath = path.join(route.routePath, file);
            const status = fs.lstatSync(_fpath);

            // is directory?
            if (!status.isDirectory()) {
                let fname = _fpath.replace(/^.*[\\\/]/, '');
                let ext = path.extname(fname);
                // extension?
                if (!!extension && !fname.match(extension)) {
                    return;
                }

                data.push({
                    name: fname.replace(ext, ''),
                    filename: fname,
                    filepath: _fpath,
                    extension: ext,
                    routeName: route.routeName,
                });
            }
        });

        return data;
    }
    /**
     * @description returns the last modified files from the folder
     * @param {String} routeName
     */

    async lastFiles(
        routeName: string,
        extension = undefined
    ): Promise<FilesDataContext[]> {
        let files: FilesDataContext[] = await this.files(routeName, extension);
        return files.sort((a, b) => {
            const bDate = fs.statSync(b.filepath).mtimeMs;
            const aDate = fs.statSync(a.filepath).mtimeMs;
            return bDate - aDate;
        });
    }

    /**
     * @description returns all the filepaths from folder and subfolders
     */
    async allFilepaths(
        folderpath: string,
        files: string[] = []
    ): Promise<string[]> {
        const directoryFiles = await fs.promises.readdir(folderpath);

        await Promise.allSettled(
            directoryFiles.map(async (file) => {
                const subpath = path.join(folderpath, file);
                if (fs.lstatSync(subpath).isDirectory()) {
                    await this.allFilepaths(subpath, files);
                } else {
                    files.push(subpath);
                }
            })
        );

        return files;
    }

    /**
     * @description return all directories of the route
     * @param {String} routeName this need to be registred on route
     * @param {RegExp} [filter=undefined] this is a regexp
     * @example
     * instance.folders('home')
     * instance.folders('home', /^\a/gi)
     * @return {Array} each element on this <array> will be a <object> with
     * the follow pattern:
     * {
     *  name: name of the folder,
     *  path: path to folder,
     * }
     */
    folders(routeName: string): FolderDataContext[] {
        const data: FolderDataContext[] = [];

        const route = this.get(routeName);
        if (!route) return data;

        let directories = fs.readdirSync(route.routePath);
        directories = directories
            .map((name) => path.join(route.routePath, name))
            .filter(this.io().isDirectory);

        directories.map((source) => {
            const name = source.replace(/^.*[\\\/]/, '');
            data.push({
                name,
                path: source,
            });
        });

        return data;
    }

    /**
     * @description create the folder if doesn't exist and join up the route
     * to another
     * @param {String} newRouteName new routename and filepath, if filepath isn't deifned
     * @param {String} referenceRouteName route name of the reference
     * @param {String} filepath if isn't defined, then will use
     * the routeName as the path to join up.
     * @returns {this}
     */

    inject(
        newRouteName: string,
        referenceRouteName: string,
        filepath?: string | undefined
    ): PathRoute {
        if (this.has(newRouteName)) return this;
        const folderPath: string = !!filepath ? filepath : newRouteName;
        this.io().createFolder(this.plug(referenceRouteName, folderPath) || '');
        this.join(newRouteName, referenceRouteName, filepath);
        return this;
    }

    /**
     * @description join the subfolder into a main folder, in ordered & structured mode.
     * Like:
     *   main-folder: src;
     *   sub-folders: data, public;
     * Be:
     *  src
     *  src/data
     *  src/public
     */

    foldersJoin(routeName: string): PathRoute {
        if (!this.has(routeName)) return this;
        this.folders(routeName).map(({ name, path }) =>
            this.add(`${routeName}/${name}`, path)
        );
        return this;
    }
}
