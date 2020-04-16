# prefix(value)

- *value* `string` Unique prefix that will be shared around all routes as prefix/RouteName

**returns** `PathRoute`

> Set a prefix for all routes

<hr>

## Example

``` js

// If you want to have some extra control element:

instance.prefix('v1')

// Take at account the example from 'set.md'

instance.get('v1/src')

``` 