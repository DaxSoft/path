'use strict'

/**
 * @file path_route
 * It register the path of folders and files
 */

// ------------------------------------------------------------------
// | [requirements]
// ------------------------------------------------------------------

const { Routes, Route } = require('vorlefan.path_route')

// ------------------------------------------------------------------
// | Main Route
// ------------------------------------------------------------------

Routes.instance((instance) => {
    instance.set('main', instance.resolve(__dirname, '..'))

    instance
        .folders('main')
        .map((folder) => instance.set(folder.name, folder.path))

    instance
        .folders('src')
        .map((folder) => instance.set(`src/${folder.name}`, folder.path))

    instance.alias('command', 'src/command')

    instance
        .folders('command')
        .map((folder) => instance.set(`command/${folder.name}`, folder.path))

    instance.setItem('json', instance.json({ routeName: 'main' }))

    const pkg = instance.getItem('json').readSync({
        route: 'main',
        filename: 'package.json',
    })

    instance.setItem('package.json', pkg)
}).namespace('Main')

// ------------------------------------------------------------------
// | Project Route
// ------------------------------------------------------------------

Routes.instance((instance) => {
    instance.set('main', instance.resolve(__dirname, '..', '..'))
    instance
        .folders('main')
        .map((folder) => instance.set(folder.name, folder.path))
    instance.setItem('json', instance.json({ routeName: 'main' }))
    const pkg = instance.getItem('json').readSync({
        route: 'main',
        filename: 'package.json',
    })

    instance.setItem('package.json', pkg)
}).namespace('Project')

// ------------------------------------------------------------------
// | [export]
// ------------------------------------------------------------------

module.exports = {
    Route,
    Routes,
    MainRoute: Route.Main,
    ProjectRoute: Route.Project,
}
