# setFolder(routeName, folderName)

- *routeName* `string` the unique ID registred with method `set`
- *folderName* `string` the name of the new folder

**returns** `PathRoute`

> Creates a new folder if it doesn't exist

<hr>

## Example

``` js

// If 'src' route is the main directory

instance.setFolder('src', 'newFolder')

// You can chain it as well

instance.setFolder('src', 'newFolder').join('newFolder', 'src')

// However, I don't recommend it since we have the method 'inject'

instance.inject('newFolder', 'src')

``` 