/*
:--------------------------------------------------------------------------
: [instance]
:--------------------------------------------------------------------------
:
:   This contents is the structure of the Instance of each Routes.
*/

import path from 'node:path';
import {
    PathRouteStructure,
    RoutesDataContext,
    RoutesStorageContext,
} from './types';

export default class PathRoute implements PathRouteStructure {
    #routes: RoutesDataContext[] = [];
    #prefix?: string;
    #namespace?: string;
    #storage: RoutesStorageContext = {};
    static instance: PathRoute;

    constructor() {
        if (PathRoute.instance) {
            return PathRoute.instance;
        }
        PathRoute.instance = this;
    }

    routes(): RoutesDataContext[] {
        return this.#routes;
    }

    has(routeName: string): boolean {
        const findRoute = this.#routes.find(
            (route) => route.routeName === routeName
        );
        return !!findRoute;
    }
}
