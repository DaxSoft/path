# plug(routeName, url)

- *routeName* `string` Unique id registred under 'this._routes'
- *url* `string` local folder url or not that will join up wit the path of the routeName

**returns** `string`

> Plug/Join up an string vaçue into the path of a route

<hr>

## Example

``` js


// Access an file's path inside of a folder

instance.plug('src', 'package.json') // __dirname/package.json


``` 