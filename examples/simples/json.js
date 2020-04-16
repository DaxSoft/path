'use strict'

/**
 * @description Example of using the FileManager and FileJSON
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

const test = async () => {
    const data = await Route.Example.getItem('json').read({
        route: 'src',
        filename: 'data.json',
    })

    return data
}

test()
    .then(async (response) => {
        const fileCreated = await Route.Example.getItem('json').store({
            route: 'test',
            filename: 'light.json',
            data: response.light,
        })

        console.log(fileCreated)
        console.log('Historic:')
        console.log(Route.Example._file.historic())
    })
    .catch((error) => console.error(error))
