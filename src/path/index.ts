/*
:--------------------------------------------------------------------------
: [instance]
:--------------------------------------------------------------------------
:
:   This contents is the structure of the Instance of each Routes.
*/

import path from 'node:path';
import { sanitizeFilepath } from '../utils/regex';
import {
    PathRouteStructure,
    RoutesDataContext,
    RoutesStorageContext,
} from './types';

export default class PathRoute implements PathRouteStructure {
    #routes: RoutesDataContext[] = [];
    #namespace?: string;
    #storage: RoutesStorageContext = {};
    static instance: PathRoute;

    constructor() {
        if (PathRoute.instance) {
            return PathRoute.instance;
        }
        PathRoute.instance = this;
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
}
