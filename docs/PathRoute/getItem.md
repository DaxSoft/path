# getItem(variableName) 

- *variableName* `string` It's the ID that is storage under the object **this._storage**

**returns** any value or undefined

<hr>

## Example

``` js 
// Using as base the example on 'setItem.md'

// Get the item 'json' and create a new json file from the default routeName 

Route.Example.setItem('json', Route.Example.json({
    default: 'template' // default routeName
}))

Route.Example.getItem('json').store({
  filename: 'test.json',
  data: [1, 2, 3]
})
```