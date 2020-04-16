# join(routeName, reference[, url])

- *routeName* `string` it will be the unique ID to access the *url* defined. If isn't unique, will overwrite. 
- *reference* `string` Set up here the route name that you want to use as reference for this route.
- *url* `string` If it is defined, then will ignore the *routeName* and instend of, it will this value to join up with the reference.

**returns** `object` or `undefined`

> Create a new route path taking as base another route already defined

<hr>

## Example

``` js

// This method uses the 'path.join'
// So it's like this:

// We have the follow route defined, where it has 
// the access of the source file of your project.

instance.set('src', __dirname)

// Let's imagine that this folder is the same as the overall folders of this
// Repository (the main), where we have 'test', 'features', 'examples', 'docs'

// Then, rather than using 'set' method and putting the whole URL of the folder,
// we use this method ´join´. Take at look:

// Instend of

instance.set('test', `${__dirname}/test`)

// We do

instance.join('test', 'src')

// We can set an alias as well, for example:

// Instend of

instance.join('docs', 'src')
instance.get('docs').path 

// We can do:

instance.join('documentation', 'src', 'docs')
instance.get('documentation')


``` 