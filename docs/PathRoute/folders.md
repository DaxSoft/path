# folder(routeName[, filter])

- *routeName* `string` the unique ID registred with method `set`
- *filter* `regex` you can filter the folders by using regex element

**returns** `array` 

> Get the list of folders of a route

<hr>

## Example

``` js

// Take as base the repository on git and let's imagine
// that we have a route named 'src', that it's the main
// folder

instance.folders('src') 

// Then:

[
    {
        name: 'example',
        path: './example'
    },

    {
        name: 'docs',
        path: './docs'
    },

    {
        name: 'features',
        path: './features'
    },

    {
        name: 'test',
        path: './test'
    }
]

// With filter

instance.folders('src', /(es|s)$/gi)

// Then:


[

    {
        name: 'docs',
        path: './docs'
    },

    {
        name: 'features',
        path: './features'
    }
    
]

``` 