'use strict';

/*
:--------------------------------------------------------------------------
: [instance]
:--------------------------------------------------------------------------
:
:   This contents is the structure of the Instance of each Routes.
*/

import path from 'path';
import { FileManager, FileJSON } from './features';

/*
:--------------------------------------------------------------------------
: Types and Interfaces
:--------------------------------------------------------------------------
*/

interface PathRoute_Routes {
    name: string;
    filepath: string;
    prefix?: string;
}

/*
:--------------------------------------------------------------------------
: Class structure pattern
:--------------------------------------------------------------------------
*/

class PathRoute {
    _routes: Array<PathRoute_Routes>;
    _prefix: string;
    _namespace: string;
    _storage: Record<string, any>;
    _io: FileManager;
    _json: FileJSON;

    constructor() {
        this._routes = [];
        this._prefix = '';
        this._namespace = '';
        this._storage = {};
        this._io = new FileManager(this);
        this._json = new FileJSON(this, '');
    }

    /**
     * @description access FileManager
     */

    io(): FileManager {
        return this._io;
    }

    /**
     * @description access FileJSON
     */

    json(): FileJSON {
        return this._json;
    }

    /**
     * @description check up if have the item storaged
     * @param variableName
     */

    hasItem(variableName: string): Boolean {
        return !!this._storage.hasOwnProperty(variableName);
    }

    /**
     * @description stores a value into the Route,
     * it can be anything
     * @param {String} variableName the ID to get access
     * @param {Any} variableValue  the Value to store
     * @param {Boolean} notSet if it is true, then check if
     * the item already exists
     * @example
     * Route.Example.setItem("add", (a, b) => a + b)
     * // or
     * Route.Example.setItem("token", "user_token")
     */

    setItem(variableName: string, variableValue: any, notSet?: boolean): any {
        if (!(this.hasItem(variableName) && !!notSet)) {
            this._storage[variableName] = variableValue;
        }
        return this._storage[variableName];
    }

    /**
     * @method getItem
     * @description access the value stored with 'setItem'
     * @param {String} variableName the ID to access
     * @example
     * Route.Example.getItem("add")(1, 2) // 3
     * @returns {Object|undefined}
     */

    getItem(variableName: string) {
        return this._storage[variableName];
    }

    /**
     * @desc returns all routes
     */

    routes(): Array<PathRoute_Routes> {
        return this._routes;
    }

    /**
     * @description check out if already has the route
     * @param {String} [routeName]
     */

    has(routeName: string): Boolean {
        const findIt = this._routes.find((route) => route.name === routeName);
        return !!findIt;
    }

    /**
     * @description removes/deletes an route
     * @param routeName
     */

    remove(routeName: string): void {
        if (!this.has(routeName)) return;
        this._routes = this._routes.filter(({ name }) => name !== routeName);
    }

    /**
     * @description set a new route path into the instance
     * @param {String} [routeName] it needs to be unique
     * @param {String} [url] can be local or url
     * @returns {Object}
     * @example
     * Route.Example.set("src", __dirname)
     */

    set(routeName: string, filepath: string): PathRoute_Routes {
        if (!this.has(routeName)) {
            const newRoute: PathRoute_Routes = {
                name: routeName,
                filepath: filepath,
            };

            this._routes.push(newRoute);

            return newRoute;
        } else {
            return this.get(routeName);
        }
    }

    /**
     * @description get the route by his name id
     * @param {String} routeName
     * @returns {Object}
     * @example
     * Route.Example.get('google') // { name: 'google', path: 'https://www.google.com.br/' }
     */

    get(routeName: string): PathRoute_Routes {
        const response = { name: '', filepath: '', prefix: '' };
        const route: any = this._routes.find(({ name }) => name === routeName);
        if (!!route) {
            return Object.assign(response, route);
        }
        return response;
    }

    /**
     * @description create an alias for a existed route
     * @param {String} alias
     * @param {String} routeName
     * @returns {PathRoute|Undefined}
     * @example
     * instance.set('src', __dirname)
     * instance.alias('main', 'src') // same as 'src'
     */

    alias(alias: string, routeName: string): PathRoute {
        if (this.has(routeName)) {
            this.set(alias, this.get(routeName).filepath);
        }
        return this;
    }

    /**
     * @description creates a new route path following up
     * another as base
     * @param {String} routeName id of the new route
     * @param {String} reference route name of the reference
     * @param {String} url if isn't defined, then will use
     * the routeName as the path to join up.
     * @returns {Object}
     * @example
     * Route.Example.join("test", "src") // ... path: __dirname + /test
     * // or
     * Route.Example.join("testExample", "src", "example") // ... path: __dirname + /example
     */

    join(
        routeName: string,
        referenceRouteName: string,
        filepath?: string
    ): PathRoute_Routes | void {
        if (this.has(referenceRouteName)) {
            const getReference = this.get(referenceRouteName);
            const newRoute: PathRoute_Routes = {
                name: routeName,
                filepath: path.join(
                    getReference.filepath,
                    filepath || routeName
                ),
            };
            this._routes.push(newRoute);
            return newRoute;
        }
    }

    /**
     * @description create the folder if doesn't exist and join up the route
     * to another
     * @param {String} routeName if of the new route
     * @param {String} reference route name of the reference
     * @param {String} url if isn't defined, then will use
     * the routeName as the path to join up.
     * @returns {this}
     */

    inject(
        routeName: string,
        referenceRouteName: string,
        filepath?: string
    ): PathRoute {
        const hasFolder = this.io().hasFolder(
            referenceRouteName,
            filepath || routeName
        );
        if (!hasFolder)
            this.io().setFolder(routeName, filepath || referenceRouteName);
        this.join(routeName, referenceRouteName, filepath);
        return this;
    }

    /**
     * @param {String} [value]
     * @description defines a prefix for each routes
     * @return {this}
     */

    prefix(prefixTag: string): PathRoute {
        this._prefix = prefixTag;

        this._routes.forEach((route) => {
            if (route.hasOwnProperty('prefix')) {
                route.name.replace(route.prefix || '', prefixTag);
            } else {
                route.name = `${prefixTag}/${route.name}`;
                route.prefix = prefixTag;
            }
        });

        return this;
    }

    /**
     * @description plug the path with a url
     * @param {String} routeName
     * @param {String} url
     * @returns {String}
     */

    plug(routeName: string, filepath: string): string {
        return path.join(this.get(routeName).filepath || '', filepath);
    }

    /**
     * @description Get the clean path of the route
     */

    clean(routeName: string): string {
        return this.get(routeName).filepath.replace(/(\/)[(/)]/g, '/');
    }

    /**
     * @description Goes to the previous folder with level
     * @param {Number} level by the default is 1
     */

    back(routeName: string, level: number = 1): string {
        if (this.has(routeName)) {
            const predPath = new Array(level).fill('..');
            return path.resolve(this.get(routeName).filepath, ...predPath);
        }
        return '';
    }

    /**
     * @description Get the last folder/file name
     * @param {String} filepath
     */

    endWith(filepath: string): string {
        const cleanPath: string = filepath.replace(/(\/)[(/)]/g, '/');
        return path.basename(cleanPath);
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
}

/*
:--------------------------------------------------------------------------
: Export
:--------------------------------------------------------------------------
*/

export default PathRoute;
