# Path Route

This npm package gives you the ability to easily access and manage the file paths of your project. Our core function is to provide a simple and intuitive way to navigate the folders and files within your project, making it easier to organize and maintain your codebase. Whether you're working on a small project or a large-scale application, this package can save you time and hassle by streamlining your file management workflow. Try it out and see how it can benefit your development process.

[![https://badgen.net/bundlephobia/minzip/@vorlefan/path](https://badgen.net/bundlephobia/minzip/@vorlefan/path)](https://bundlephobia.com/result?p=@vorlefan/path)]

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
-   Manage your files with the power of CRUD methods.
-   Easy to use

<hr>

### Example

Please, take a look at the 'example' folder of this repository

```js
'use strict';

/**
 * @description Basic usage of this module.
 * This will take at account this folder (module folder),
 * as example.
 */

const { Routes, Route } = require('./src');

// Create a new route instance and give it a name

Routes.instance((instance) => {
    instance.set('src', instance.resolve(__dirname, '..'));
    instance.join('test', 'src');
    instance.join('examples', 'src');
}, 'Basic');

// Access

console.log(Route.Basic.get('test'));
console.log(Route.Basic.get('examples').filepath);
```
