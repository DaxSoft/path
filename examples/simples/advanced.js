'use strict'

/**
 * @description Advanced(?) level of usage of this module.
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

// Creates an random json file just for example

Route.Example.getItem('json').store({
    filename: `${Date.now().toString(16)}.json`,
    data: {
        random: 'just tests',
        animals: 'Wolf and Ravens',
    },
})

// Creates a item that will receive all loaded .json

Route.Example.setItem('jsonLoaded', [])

// Loads all json file from 'template' and 'src'

const jsonFiles = [
    ...Route.Example.files('src', 'json').concat(
        Route.Example.files('template', 'json')
    ),
]

const loadJsonFiles = (files) => {
    files.map((value) => {
        try {
            const response = Route.Example.getItem('json').read({
                route: value.routeName,
                filename: value.filename,
            })

            Route.Example.getItem('jsonLoaded').push(response)
        } catch (error) {}
    })
}

loadJsonFiles(jsonFiles)

console.log(Route.Example.getItem('jsonLoaded')[0])
