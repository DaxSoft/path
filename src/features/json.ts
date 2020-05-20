'use strict';

import PathRoute from '../instance';

/**
 * @class FileJson
 * @classdesc Manage the json file, read and create as well
 */

// ------------------------------------------------------------------
// | [Types]
// ------------------------------------------------------------------

interface IFileJSON_Read {
    routeName?: string;
    filename: string;
}

interface IFileJSON_Store {
    routeName?: string;
    filename: string;
    data: any;
    force?: boolean;
}

// ------------------------------------------------------------------
// | [Class]
// ------------------------------------------------------------------

class FileJson {
    _route: PathRoute;
    _routeName: string;

    constructor(route: PathRoute, routeName: string) {
        this._route = route;
        this._routeName = routeName;
        return this;
    }

    /**
     * @description set the default route name
     * @param {String} string
     */

    set(routeName: string): FileJson {
        this._routeName = routeName;
        return this;
    }

    /**
     * @description Synchronously read the json file
     * @param {String} routeName id of the route
     * @param {String} filename
     * @returns {Object}
     */

    readSync({
        routeName = this._routeName,
        filename,
    }: IFileJSON_Read): Object | Array<[]> {
        const content = this._route.io().readSync({
            routeName,
            filename,
        });
        const response =
            typeof content === 'string' ? JSON.parse(content || '{}') : content;
        return response;
    }

    /**
     * @description Asynchronously read the json file
     * @param {String} routeName id of the route
     * @param {String} filename
     * @returns {Object}
     */

    async read({
        routeName = this._routeName,
        filename,
    }: IFileJSON_Read): Promise<Object | Array<[]> | undefined> {
        const content = await this._route.io().read({
            routeName,
            filename,
        });

        const response =
            typeof content === 'string' ? JSON.parse(content || '{}') : content;

        return response;
    }

    /**
     * @description Synchronously store the json file
     * @param {String} routeName id of the route
     * @param {String} filename
     * @param {Object} data
     * @returns {Boolean}
     */

    storeSync({
        routeName = this._routeName,
        filename,
        data,
        force = true,
    }: IFileJSON_Store) {
        const stringify = JSON.stringify(data, null, '\t');
        const response = this._route.io().storeSync({
            routeName,
            filename,
            data: stringify,
            force,
        });
        return response;
    }

    /**
     * @description Asynchronously store the json file
     * @param {String} routeName id of the route
     * @param {String} filename
     * @param {Object} data
     * @returns {Boolean}
     */

    async store({
        routeName = this._routeName,
        filename,
        data,
        force = true,
    }: IFileJSON_Store): Promise<any> {
        const stringify = JSON.stringify(data, null, '\t');
        const response = await this._route.io().store({
            routeName,
            filename,
            data: stringify,
            force,
        });
        return response;
    }

    /**
     * @description Synchronously deletes a json file
     * @param {String} routeName id of the route
     * @param {String} filename
     */

    removeSync({
        routeName = this._routeName,
        filename,
    }: IFileJSON_Read): Boolean {
        const response = this._route.io().removeSync({
            routeName,
            filename,
        });
        return response;
    }

    /**
     * @description Asynchronously deletes a json file
     * @param {String} routeName id of the route
     * @param {String} filename
     */

    async remove({
        routeName = this._routeName,
        filename,
    }: IFileJSON_Read): Promise<Boolean> {
        const response = await this._route.io().remove({
            routeName,
            filename,
        });
        return response;
    }
}

// ------------------------------------------------------------------
// | [Export]
// ------------------------------------------------------------------

export default FileJson;
