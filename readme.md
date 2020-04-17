# Path Route

This is my first npm package module. The main function is to give the power of easily accessing the folders and files of your project.

With [npm](https://npmjs.org) do:

```
npm install @vorlefan/path
```

With [yarn](https://yarnpkg.com/en/) do:

```
yarn add  @vorlefan/path
```

<hr>

### Documentation

You can access on the folder 'docs' of this repository
A better documentation will be made at the near future.

<hr>

### Highlight

-   Create several custom routes to access different folders & files
-   Without any dependency
-   Manage your files with the power to read and store
-   Easy to use

<hr>

### Example

Please, take a look at the 'example' folder of this repository

```js
'use strict'

/**
 * @description Basic usage of this module.
 * This will take at account this folder (module folder),
 * as example.
 */

const { Routes, Route } = require('./src')

// Create a new route instance and give it a name

Routes.instance((instance) => {
    instance.set('src', instance.resolve(__dirname, '..'))
    instance.join('test', 'src')
    instance.join('examples', 'src')
}).namespace('Basic')

// Access

console.log(Route.Basic.get('test'))
console.log(Route.Basic.get('examples').path)
```
