# AsyncPlugin

**Another way to implement AOP in JavaScript.**

By using this module, one can easily write pluggable and extendable components
to manipulate objects and be benefit from `async/await` functionality.

*PS: this module internally uses [function-intercepter](https://github.com/hyurl/function-intercepter) to bind and call functions.*

## Install

```sh
npm i async-plugin
```

## Example

```typescript
import AsyncPlugin from "async-plugin";

var plugin = new AsyncPlugin();

// Bind a handler function to add a name on the output object.
plugin.bind((input, output) => {
    output.name = input.name || "Ayon Lee";
});

// Bind an async handler to fetch data from the internet and assign them to the
// output object if the input one doesn't have cache data.
plugin.bind(async (input, output) => {
    if (input.cache) {
        Object.assign(output, input.cache);
    } else {
        let res = await fetch(`https://somewhere.com/data?name=${output.name}`);
        let data = await res.json();

        input.cache = data;
        Object.assign(output, data);
    }
});

(async () => {
    var obj = {};

    // Apply the plugin and called bound handlers.
    var output = await plugin.apply(obj);

    console.log(output); // => { name: "Ayon Lee", ... }
})();
```

## API

### Create a plugin

To create an AsyncPlugin instance, there are several signatures you can use:

- `new AsyncPlugin<I = any, O = any>()`
- `new AsyncPlugin<I, O = any>(inputType?: I | (new (...arg) => I))`
- `new AsyncPlugin<I, O>(inputType?: I | (new (...args) => I), outputType?: O | (new (...args) => O))`

**inputType**

The prototype of the input object, it is very common to set this 
argument a class constructor or `null` to indicate any types.

**outputType**

The prototype of output object, when apply the plugin, a new object created via 
`Object.create(outputType)` will be passed to the first handler.

*Note that both `inputType` and `outputType` can be omitted, passing them is*
*mainly for type hints in the IDE, and when omitted, they will be assigned*
*`Object`.*

### Bind a handler

To bind a handler on the plugin, just call the `plugin.bind()` method, which 
accepts the signature in this way:

- `plugin.bind((input: I, output?: O) => void | false | [I, O] | Promise<void | false | [I, O]>): this`

Normally this method will not return anything, but when it does, the `false` 
value indicates to stop calling remaining handlers and return the `output` 
object immediately. Other than `false`, the only acceptable returning value is 
an array contains both the `input` and `output` objects, and when they're 
returned,they will be passed to the next handler as arguments. That means you're
allowed to return a different value in the previous handler so that to change 
the context in the next handler (however it's not recommended).

### Apply the plugin

To apply the plugin in a context, just call `plugin.apply()` method and pass the
`input` object and optional `output` object as default value.

- `plugin.apply(input: I, output?: O): Promise<O>`

If `output` is omitted, it will be generated via `Object.create(outputType)` as 
talked above. After all the handlers are called, this method returns the output 
object.