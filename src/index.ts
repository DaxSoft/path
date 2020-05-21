'use strict';

/*
:--------------------------------------------------------------------------
: @vorlefan/path
:--------------------------------------------------------------------------
:
:   This package means to let you handle with files & folders path into a
: easy way. As well, contains methods to bootstrap your productive in handling
: with files.
*/

import PathRoute from './instance';

interface RoutesInterface {
    _routes: Array<PathRoute>;
    route: Record<string, PathRoute>;
    instance: Function;
    save: Function;
    load: Function;
}

interface IRoutesSave {
    instance: PathRoute;
    routeName: string;
    filename: string;
    force?: boolean;
}

const Routes: RoutesInterface = {
    _routes: [],
    route: {},
    instance: Function,
    save: Function,
    load: Function,
};

const Route: Record<string, PathRoute> = {};

/*
:--------------------------------------------------------------------------
: [instance]
:--------------------------------------------------------------------------
:
:   Main file that contains all structure of the Route class.
*/

/**
 * @description  Create a new Route instance.
 * @param {Function} callback Has as paramaters the Instance class
 * @returns {Instance}
 */

Routes.instance = function routesInstance(
    callback: Function,
    namespace: string
): PathRoute {
    const pathRoute: PathRoute = new PathRoute();
    pathRoute._namespace = namespace;
    callback({ instance: pathRoute });
    Routes._routes.push(pathRoute);
    Routes.route[namespace] = pathRoute;
    Route[namespace] = pathRoute;
    return pathRoute;
};

/**
 * @function save
 * It saves the setup of routes from a Instance
 * @param {Instance} instance
 * @param {String} routeName that will be host for the file
 * @param {String} filename
 * @returns {Boolean}
 */

Routes.save = function ({
    instance,
    routeName,
    filename,
    force = true,
}: IRoutesSave): Boolean {
    if (!instance || !(instance instanceof PathRoute)) return false;
    const data = instance.routes();
    instance.json().set(routeName).storeSync({ filename, data, force });
    return true;
};

/**
 * @function load
 * loads the setup of a route json file and returns a new instance
 * @param {String} filepath
 * @example
 * Routes.load('./test/basic.json').namespace('Basic')
 */

Routes.load = function (filepath: string) {
    const instance = new PathRoute();

    let data: any = instance.io().readSync({ filename: '', folder: filepath });

    if (!!data) {
        data = JSON.parse(data);
        data.map((route) => instance.set(route.name, route.path));
    }

    Routes._routes.push(instance);
    return instance;
};

/*
:--------------------------------------------------------------------------
: [export]
:--------------------------------------------------------------------------
*/

export { Route, Routes };
