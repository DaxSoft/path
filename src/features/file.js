'use strict';

/**
 * @class FileManager
 * @classdesc Manage the files of your routes 
 */

// ------------------------------------------------------------------
// | [requirements]
// ------------------------------------------------------------------

const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');


function FileManager() {
    this.initialize.apply(this, arguments);
};

FileManager.prototype = Object.create(FileManager);
FileManager.prototype.constructor = FileManager;


/**
 * @method initialize
 * @param {PathRoute} route the class instance
 */

FileManager.prototype.initialize = function (route) {
    this._route = route;
    this._routeName = '' // default route name
    this._historic = []
    return this;
}


/**
 * @method setRoute 
 * @description set the default route name
 * @param {String} string 
 */

FileManager.prototype.setRoute = function (routeName) {
    this._routeName = routeName;
    return this;
}


/**
 * @method last 
 * @description access the last file was handled
 * @returns {Object}
 */

FileManager.prototype.last = function () {
    return [...this._historic].pop()
}


/**
 * @method historic 
 * @description access the historic of files
 * @returns {Object}
 */

FileManager.prototype.historic = function () {
    return [...this._historic]
}


/**
 * @method setHistoric 
 * @description set a historic 
 * @returns {Object}
 */

FileManager.prototype.setHistoric = function (route, filename, type) {

    const historic = {
        route,
        filename,
        type
    }

    this._historic.push(historic)

    return this;
}


/**
 * @method accessFile 
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

FileManager.prototype.accessFile = async function (filepath, fsModes = ['R_OK', 'F_OK']) {
    const mode = fsModes.map(el => fs.constants[el]).reduce((acc, cur) => cur | acc)
    return await new Promise((resolve, reject) => {
        fsPromises.access(filepath, mode)
            .then(resolve(true))
            .catch(reject(false))
    })
}


/**
 * @method copy
 * @description Asynchronously copy the file
 * @param {Sintrg} route to paste
 * @param {String} filepath to be copy
 * @returns {Boolean}
 */

FileManager.prototype.copy = async function (route, filepath) {
    const fileExists = await this.accessFile(filepath);
    if (!fileExists) return false;
    await fsPromises.copyFile(filepath, this._route.plug(route, path.basename(filepath)))
    return true;
}



/**
 * @method readSync
 * @description Synchronously read the file and return his data
 * @param {String} [routeName] id of the route
 * @param {String} [filename] the name of the file to read
 * @param {String} [folder] if this is defined it will ignore the routeName
 * path
 * @returns {String}
 */

FileManager.prototype.readSync = function ({
    route = this._routeName,
    filename,
    folder = null
}) {

    if (!this._route.has(route) && folder === null) return undefined;

    const filepath = typeof folder === 'string' ? path.join(folder, filename) : this._route.plug(route, filename)


    if (!fs.existsSync(filepath)) {
        return false;
    }

    this.setHistoric(route, filename, 'read')

    return fs.readFileSync(filepath, 'utf8')
}


/**
 * @method readSync
 * @description Asynchronously read the file and return his data
 * @param {String} [routeName] id of the route
 * @param {String} [filename] the name of the file to read
 * @returns {String}
 */

FileManager.prototype.read = async function ({
    route = this._routeName,
    filename,
    folder = null
}) {

    if (!this._route.has(route)) return undefined;

    const filepath = typeof folder === 'string' ? path.join(folder, filename) : this._route.plug(route, filename)
    const isReadable = await this.accessFile(filepath)

    if (isReadable) {
        this.setHistoric(route, filename, 'read')
        return await fsPromises.readFile(filepath, 'utf8');
    } else {
        return false;
    }
}


/**
 * @method store
 * @description Synchronously store/create a new file on the folder
 * @param {String} [routeName] if of the route
 * @param {String} [filename] the name of the file that will be created
 * @param {Boolean} [force=true] if it exists, then write over
 * @returns {Boolean}
 */

FileManager.prototype.storeSync = function ({
    route = this._routeName,
    filename,
    force = true,
    data
}) {
    if (!this._route.has(route)) return undefined;

    const filepath = this._route.plug(route, filename)

    const fileExists = fs.existsSync(filepath)

    if (fileExists && !force) return true;

    fs.writeFileSync(filepath, data, 'utf8')

    this.setHistoric(route, filename, 'write')

    return true;
}


/**
 * @method store
 * @description Asynchronously store/create a new file on the folder
 * @param {String} [routeName] if of the route
 * @param {String} [filename] the name of the file that will be created
 * @param {Boolean} [force=true] if it exists, then write over
 * @returns {Boolean}
 */

FileManager.prototype.store = async function ({
    route = this._routeName,
    filename,
    force = true,
    data
}) {
    if (!this._route.has(route)) return undefined;

    const filepath = this._route.plug(route, filename)

    const fileExists = fs.existsSync(filepath)

    if (fileExists && !force) return true;

    await fsPromises.writeFile(filepath, data, 'utf8')

    this.setHistoric(route, filename, 'write')

    return true;
}



/**
 * @method dispose 
 * @description Synchronously delete an file 
 * @param {String} [routeName] if of the route
 * @param {String} [filename] the name of the file that will be created
 * @returns {Boolean}
 */

FileManager.prototype.disposeSync = function ({
    route = this._routeName,
    filename
}) {

    if (!this._route.has(route)) return undefined;

    const filepath = this._route.plug(route, filename)

    if (!fs.existsSync(filepath)) {
        return true;
    }

    this.setHistoric(route, filename, 'delete')

    return fs.unlinkSync(filepath)
}


module.exports = FileManager;