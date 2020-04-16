# hasFolder(routeName, folderName)

- *routeName* `string` the unique ID registred with method `set`
- *folderName* `string` name of the folder that will be checked

**returns** `boolean` 

> Check out if the folder exists

<hr>

## Example

``` js

// Exists?

const folderExists = instance.hasFolder('src', 'newFolder')
if (!folderExists) instance.setFolder('src', 'newFolder')

// But if it's the case we can use *inject*

``` 