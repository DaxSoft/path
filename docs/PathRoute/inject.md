# inject(routeName, reference[, url])

- *routeName* `string` it will be the unique ID to access the *url* defined. If isn't unique, will overwrite. 
- *reference* `string` Set up here the route name that you want to use as reference for this route.
- *url* `string` If it is defined, then will ignore the *routeName* and instend of, it will this value to join up with the reference.

**returns** `object` or `undefined`

> creates the folder if it doesn't exist as well create the route for this folder

<hr>

## Example

``` js

// Let's imagine that we want to at the same time we create a new route to access some folder
// we create as well, the folder.
// This method uses the method 'join' as end point, so take at look at his doc.

// Example, we have our route 'src'
// Then we want to create a new folder (if it doesn't exist) and create a route for this folder

instance.inject('newFolder', 'src')

``` 