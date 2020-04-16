'use strict'

/*
:--------------------------------------------------------------------------
: @vorlefan/path
:--------------------------------------------------------------------------
:
:   This package means to let you handle with files & folders path into a
: easy way. As well, contains methods to bootstrap your productive in handling
: with files.
*/

const Routes = { _routes: [], route: {} }
const Route = {}

/*
:--------------------------------------------------------------------------
: [instance]
:--------------------------------------------------------------------------
:
:   Main file that contains all structure of the Route class.
*/

const Instance = require('./instance')

/**
 * @method namespace
 * Defines the namespace of the route.
 * This will set this class to the variable 'Routes'
 * @param {String} name
 * @return {this}
 */

Instance.prototype.namespace = function (name) {
    this._namespace = name
    Routes.route[name] = this
    Route[name] = this
    return this
}

/*
:--------------------------------------------------------------------------
: [Routes]
:--------------------------------------------------------------------------
:
:   Overall methods to create a Instance and handle it
*/

/**
 * @method instance
 * Create a new Route instance.
 * @param {Function} callback Has as paramaters the Instance class
 * @returns {Instance}
 */

Routes.instance = function (callback) {
    const instance = new Instance()
    callback(instance)
    Routes._routes.push(instance)
    return instance
}

/**
 * @function save
 * It saves the setup of routes from a Instance
 * @param {Instance} instance
 * @param {String} routeName that will be host for the file
 * @param {String} filename
 * @returns {Boolean}
 */

Routes.save = function ({ instance, routeName, filename, force }) {
    if (!instance || !(instance instanceof Instance)) return false

    instance
        .json({
            routeName,
        })
        .storeSync({
            filename,
            data: instance.routes(),
            force,
        })

    return true
}

/**
 * @function load
 * loads the setup of a route json file and returns a new instance
 * @param {String} filepath
 * @example
 * Routes.load('./test/basic.json').namespace('Basic')
 */

Routes.load = function (filepath) {
    const instance = new Instance()

    let data = instance._file.readSync({ filename: '', folder: filepath })

    if (data !== false) {
        data = JSON.parse(data)
        data.map((route) => instance.set(route.name, route.path))
    }

    Routes._routes.push(instance)
    return instance
}

/*
:--------------------------------------------------------------------------
: [export]
:--------------------------------------------------------------------------
*/

module.exports = {
    Routes,
    Route,
}
