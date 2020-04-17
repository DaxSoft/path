# 1.4.1

-   New method named 'back'. In which goes to the previous folder from the current one.
    Ex:

```js
Routes.instance((instance) => {
    instance.set('src', 'example/test/abc')
}).namespace('Basic')
Routes.Basic.back('src') // example/test instend of example/test/abc

// You can ajust the level
Routes.Basic.back('src', 2) // example instend of example/test/abc
```

-   New method to access the File functions from FileManager. Use 'io()' function.

```js
Route.Basic.io().accessFile(filepath)
```

-   New method to get the name of the last folder name from a path.

```js
Route.Basic.endWith('/example/test') // test
```

# 1.4.0

-   First release under @vorlefan/path
-   Code packaged with webpack
-   Test with Jest
