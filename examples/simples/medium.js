'use strict'

/**
 * @description Medium level of usage of this module.
 */

const { Routes, Route } = require('@vorlefan/path')

// Creates an instance

Routes.instance((instance) => {
    instance.set('src', __dirname)
    instance.join('test', 'src')

    // inject the folder if it don't exists

    instance.inject('template', 'test')
}).namespace('Example')

// Creates a item that it's able to handle with json file

Route.Example.setItem(
    'json',
    Route.Example.json({
        routeName: 'template', // default routeName
    })
)

// Save our instance

Routes.save({
    instance: Route.Example,
    routeName: 'template',
    filename: 'example.json',
})

// Creates an random json file just for example

Route.Example.getItem('json').store({
    filename: `${Date.now().toString(16)}.json`,
    data: {
        random: 'just tests',
        animals: 'Wolf and Ravens',
    },
})

// Create another instance follows the saved route instance

Routes.load(Route.Example.plug('template', 'example.json')).namespace('Test')

console.log(Route.Test.routes())
