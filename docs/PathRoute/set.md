# set(routeName, url)

- *routeName* `string` it will be the unique ID to access the *url* defined. If isn't unique, will overwrite. 
- *url* `string` local folder url or not

**returns** `object`

> Set a new route to be registred

<hr>

## Example

``` js

// Take at account that the follow variable is from the instance PathRoute

instance.set('src', __dirname)
instance.set('example', '../examples')

``` 