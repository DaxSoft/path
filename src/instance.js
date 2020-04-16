'use strict'

/*
:--------------------------------------------------------------------------
: [instance]
:--------------------------------------------------------------------------
:
:   This contents is the structure of the Instance of each Routes.
*/

const fs = require('fs')
const path = require('path')

const { FileJSON, FileManager } = require('./features/index')

/*
:--------------------------------------------------------------------------
: Prototype structure pattern
:--------------------------------------------------------------------------
*/

function PathRoute() {
    this.initialize.apply(this, arguments)
}

PathRoute.prototype = Object.create(PathRoute)
PathRoute.prototype.constructor = PathRoute

/**
 * @method initialize
 * Initialize the instance of the class
 */

PathRoute.prototype.initialize = function () {
    this._routes = []
    this._prefix = ''
    this._namespace = ''
    this._storage = {}
    this._file = new FileManager(this)
}

/**
 * @method setItem
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
 * @returns {Object}
 */

PathRoute.prototype.setItem = function (
    variableName,
    variableValue,
    notSet = false
) {
    return this._storage.hasOwnProperty(variableName) && notSet
        ? this._storage[variableName]
        : (this._storage[variableName] = variableValue)
}

/**
 * @method getItem
 * @description access the value stored with 'setItem'
 * @param {String} variableName the ID to access
 * @example
 * Route.Example.getItem("add")(1, 2) // 3
 * @returns {Object|undefined}
 */

PathRoute.prototype.getItem = function (variableName) {
    return this._storage[variableName]
}

/**
 * @method set
 * @description set a new route path into the instance
 * @param {String} [routeName] it needs to be unique
 * @param {String} [url] can be local or url
 * @returns {Object}
 * @example
 * Route.Example.set("src", __dirname)
 */

PathRoute.prototype.set = function (routeName, url) {
    if (!this.has(routeName)) {
        const nroute = {
            name: routeName,
            path: url,
        }
        this._routes.push(nroute)
        return nroute
    } else {
        return this.get(routeName)
    }
}

/**
 * @method alias
 * @description create an alias for a existed route
 * @param {String} alias
 * @param {String} routeName
 * @returns {PathRoute|Undefined}
 * @example
 * instance.set('src', __dirname)
 * instance.alias('main', 'src') // same as 'src'
 */

PathRoute.prototype.alias = function (alias, routeName) {
    if (!this.has(routeName)) return undefined
    this.set(alias, this.get(routeName).path)
    return this
}

/**
 * @method get
 * @description get the route by his name id
 * @param {String} routeName
 * @returns {Object}
 * @example
 * Route.Example.get('google') // { name: 'google', path: 'https://www.google.com.br/' }
 */

PathRoute.prototype.get = function (routeName) {
    return this._routes.find((element) => element.name === routeName)
}

/**
 * @method join
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

PathRoute.prototype.join = function (routeName, reference, url) {
    if (this.has(reference)) {
        reference = this.get(reference)
        const nroute = {
            name: routeName,
            path: path.join(reference.path, url || routeName),
        }
        this._routes.push(nroute)
        return nroute
    }
    return undefined
}

/**
 * @method inject
 * @description create the folder if doesn't exist and join up the route
 * to another
 * @param {String} routeName if of the new route
 * @param {String} reference route name of the reference
 * @param {String} url if isn't defined, then will use
 * the routeName as the path to join up.
 * @returns {this}
 */

PathRoute.prototype.inject = function (routeName, reference, url = null) {
    if (!this.hasFolder(reference, url || routeName))
        this.setFolder(reference, url || routeName)
    this.join(routeName, reference, url)
    return this
}

/**
 * @method has
 * @description check out if already has the route
 * @param {String} [routeName]
 */

PathRoute.prototype.has = function (routeName) {
    const find = this._routes.find((element) => element.name === routeName)
    return !!find
}

/**
 * @method prefix
 * @param {String} [value]
 * @description defines a prefix for each routes
 * @return {this}
 */

PathRoute.prototype.prefix = function (value) {
    this._prefix = value
    // in each
    this._routes.forEach((route) => {
        // check if there is a prefix already
        if (route.hasOwnProperty('prefix')) {
            route.name.replace(route.prefix, value)
        } else {
            route.name = `${value}/${route.name}`
            route.prefix = value
        }
    })
    //
    return this
}

/**
 * @method routes
 * @description return all routes
 * @return {Array}
 */
PathRoute.prototype.routes = function () {
    return this._routes
}

/**
 * @method plug
 * @description plug the path with a url
 * @param {String} routeName
 * @param {String} url
 * @returns {String}
 */

PathRoute.prototype.plug = function (routeName, url) {
    return path.join(this.get(routeName).path, url)
}

/**
 * Get the clean path of the route
 */

PathRoute.prototype.clean = function (routeName) {
    return this.get(routeName).path.replace(/(\/)[(/)]/g, '/')
}

/**
 * @method resolve
 * @description Alias for 'path.resolve'
 * @param {String} [paths]
 */

PathRoute.prototype.resolve = function (...paths) {
    return path.resolve(...paths)
}

/**
 * @method basename
 * @description Alias for 'path.basename'
 * @param {String} [paths]
 */

PathRoute.prototype.basename = function (...values) {
    return path.basename(...values)
}

/**
 * @method dirname
 * @description Alias for 'path.dirname'
 * @param {String} [paths]
 */

PathRoute.prototype.dirname = function (...values) {
    return path.dirname(...values)
}

/**
 * @method files
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

PathRoute.prototype.files = function (routeName, extension) {
    // route && check out if folder exists
    if (!this.has(routeName)) return []
    const route = this.get(routeName)
    if (!fs.existsSync(route.path)) return []

    // extension
    if (typeof extension === 'string') {
        extension = new RegExp(`\.(${extension})$`, 'gi')
    }

    // stocker
    const stock = []

    // get the files
    const files = fs.readdirSync(route.path)
    let i = files.length
    while (i--) {
        const filepath = path.join(route.path, files[i])
        const status = fs.lstatSync(filepath)
        // check out if it is not directory
        if (!status.isDirectory()) {
            let filename = filepath.replace(/^.*[\\\/]/, '')
            let ext = path.extname(filename)

            // extension filter?

            if (
                extension &&
                typeof extension === 'string' &&
                !filename.match(extension)
            ) {
                continue
            }

            stock.push({
                name: filename.replace(ext, ''),
                filename: filename,
                path: filepath,
                extension: ext,
                routeName,
            })
        }
    }

    return stock
}

/**
 * @method json
 * @description One in all function to manage a .json file,
 * you can use it to either read or create.
 * @param {String} routeName defines a default routeName
 * @see FileJSON
 * @returns {FileJSON}
 */

PathRoute.prototype.json = function ({ routeName }) {
    return new FileJSON(this, {
        routeName,
    })
}

/**
 * @method folders
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

PathRoute.prototype.folders = function (routeName, filter = undefined) {
    if (!this.has(routeName)) return []
    const route = this.get(routeName)

    const isDirectory = (source) => fs.lstatSync(source).isDirectory()
    const directories = fs
        .readdirSync(route.path)
        .map((name) => path.join(route.path, name))
        .filter(isDirectory)

    const stock = []

    // filter?
    if (filter && filter instanceof RegExp) {
        directories
            .filter((fsource) => filter.test(fsource.replace(/^.*[\\\/]/, '')))
            .map((source) => {
                stock.push({
                    name: source.replace(/^.*[\\\/]/, ''),
                    path: source,
                })
            })
    } else {
        directories.map((source) => {
            stock.push({
                name: source.replace(/^.*[\\\/]/, ''),
                path: source,
            })
        })
    }

    // return
    return stock
}

/**
 * @method setFolder
 * @description create a new folder if it doesn't exist
 * @param {String} routeName
 * @param {String} folderName
 */

PathRoute.prototype.setFolder = function (routeName, folderName) {
    if (this.hasFolder(routeName, folderName)) return this
    fs.mkdirSync(path.join(this.get(routeName).path, folderName), false)
    return this
}

/**
 * @method hasFolder
 * @description check out if have the file on the folder
 * @param {String} routeName
 * @param {String} folderName
 * @returns {Object|undefined}
 */

PathRoute.prototype.hasFolder = function (routeName, folderName) {
    return this.folders(routeName).find((file) => file.name === folderName)
}

// ------------------------------------------------------------------
// | [exports]
// ------------------------------------------------------------------

module.exports = PathRoute
