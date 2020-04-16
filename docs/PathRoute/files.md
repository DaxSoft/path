# files(routeName[, extension])

- *routeName* `string` the unique ID registred with method `set`
- *extension* `string` you can filter the files by extension

**returns** `array` 

> Get the list of files of an folder

<hr>

## Example

``` js

// Take as base the repository on git and let's imagine
// that we have a route named 'src', that it's the main
// folder

instance.files('src') 

// Then:

[
    {
        name: 'LICENSE',
        filename: 'LICENSE',
        path: './LICENSE',
        extension: ''
    },

    {
        name: 'README',
        filename: 'README.md',
        path: './README.md',
        extension: '.md'
    },

    {
        name: 'index',
        filename: 'index.js',
        path: './index.js',
        extension: '.js'
    },

    {
        name: 'instance',
        filename: 'instance.js',
        path: './instance.js',
        extension: '.js'
    },

    
    {
        name: 'package',
        filename: 'package.json',
        path: './package.json',
        extension: '.json'
    },

    {
        name: 'readme',
        filename: 'readme.md',
        path: './readme.md',
        extension: '.md'
    }
]

// With filter

instance.files('src', 'json')

// Then:


[

    {
        name: 'package',
        filename: 'package.json',
        path: './package.json',
        extension: '.json'
    }
    
]

``` 