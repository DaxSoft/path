# setItem(variableName, variableValue[, notSet=false])

- *variableName* `string` It's the ID that will be stored on the object 'this._storage', it needs to be unique, otherwise will overwrite 
the one that has the same ID.
- *variableValue* `...` The value can be anything, be string, object or function. 
- *notSet* `boolean` if it is **true**, then will check if the ID already exists or not. If it exists, then will not overwrite

**returns** any value or undefined

<hr>

## Example

``` js 
// Creates a item that it's able to handle with json file

Route.Example.setItem('json', Route.Example.json({
    default: 'template' // default routeName
}))

// More simple

Route.Example.setItem('token', Date.now().toString(16))
```