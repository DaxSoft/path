'use strict'

/**
 * @description Basic usage of this module.
 * This will take at account this folder (module folder),
 * as example.
 */

const { Routes, Route } = require('@vorlefan/path')

// Create a new route instance and give it a name

Routes.instance((instance) => {
    instance.set('src', instance.resolve(__dirname, '..'))
    instance.join('test', 'src')
    instance.join('examples', 'src')
}).namespace('Basic')

// Access

console.log(Route.Basic.get('test'))
console.log(Route.Basic.get('examples').path)
