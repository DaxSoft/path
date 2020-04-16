# alias(alias, routeName)

- *alias* `string` the new routeName that will act as alias
- *routeName* `string`  the unique ID registred with method `set` 


**returns** `PathRoute`

> Define a alias for an route that already exists

<hr>

## Example

``` js

// Take at account that the follow variable is from the instance PathRoute

instance.set('src', __dirname)
instance.alias('main', 'src') // same value as 'src'

``` 