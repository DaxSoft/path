'use strict';

/**
 * @class FileJSON
 * @classdesc Manage the json file, read and create as well
 * destroy.
 */


function FileJSON() {
    this.initialize.apply(this, arguments);
};

FileJSON.prototype = Object.create(FileJSON);
FileJSON.prototype.constructor = FileJSON;


/**
 * @method initialize
 * @param {PathRoute} route the class instance
 */

FileJSON.prototype.initialize = function (route, {
    routeName
}) {
    this._route = route;
    this._routeName = routeName // default route name
    this._file = this._route._file
    return this;
}


/**
 * @method set 
 * @description set the default route name
 * @param {String} string 
 */

FileJSON.prototype.setRoute = function (routeName) {
    this._routeName = routeName;
    return this;
}



/**
 * @method readSync
 * @description Synchronously read the json file
 * @param {String} routeName id of the route
 * @param {String} filename 
 * @returns {Object}
 */

FileJSON.prototype.readSync = function ({
    route = this._routeName,
    filename
}) {
    const data = this._file.readSync({
        route,
        filename
    })
    const response = typeof data === 'string' ? JSON.parse(data) : data;
    return response;
}


/**
 * @method read
 * @description Asynchronously read the json file
 * @param {String} routeName id of the route
 * @param {String} filename 
 * @returns {Object}
 */

FileJSON.prototype.read = async function ({
    route = this._routeName,
    filename
}) {
    const data = await this._file.read({
        route,
        filename
    })
    const response = typeof data === 'string' ? JSON.parse(data) : data;
    return response;
}


/**
 * @method storeSync
 * @description Synchronously store the json file
 * @param {String} routeName id of the route
 * @param {String} filename 
 * @param {Object} data 
 * @returns {Boolean}
 */

FileJSON.prototype.storeSync = function ({
    route = this._routeName,
    filename,
    data,
    force = true
}) {
    return this._file.storeSync({
        route,
        filename,
        data: JSON.stringify(data, null, "\t"),
        force
    })
}


/**
 * @method storeSync
 * @description Asynchronously store the json file
 * @param {String} routeName id of the route
 * @param {String} filename 
 * @param {Object} data 
 * @returns {Boolean}
 */

FileJSON.prototype.store = async function ({
    route = this._routeName,
    filename,
    data,
    force = true
}) {
    return await this._file.store({
        route,
        filename,
        data: JSON.stringify(data, null, "\t"),
        force
    })
}


/**
 * @method dispose 
 * @param {String} routeName id of the route
 * @param {String} filename 
 * @returns {Boolean}
 */

FileJSON.prototype.dispose = function ({
    route = this._routeName,
    filename
}) {
    return this._file.dispose({
        route,
        filename
    })
}


// ------------------------------------------------------------------
// | [exports]
// ------------------------------------------------------------------

module.exports = FileJSON;