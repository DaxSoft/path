# json({ routeName, })

- *routeName* `string` defines a default route name

**returns** `FileJSON` 

> Handle with json files, stores, read, destroy

<hr>

## Example

``` js

// Normal

const fileJSON = instance.json()

// Recommended

instance.setItem('json', instance.json())

// With options

instance.setItem('json', instance.json({
    routeName: 'example'
}))

``` 