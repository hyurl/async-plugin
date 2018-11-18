export class AsyncPlugin<I = any, O = any> {
    protected inputType: I;
    protected outputType: O;

    /**
     * @param inputType The prototype of the input object, it is very common to 
     *  set this argument a class constructor or `null` to indicate any types.
     * @param outputType The prototype of output object, when apply the plugin, 
     *  a new object created via `Object.create(outputType)` will be passed to 
     *  the first handler.
     */
    constructor(inputType?: I | (new (...args) => I), outputType?: O | (new (...args) => O));

    /**
     * Binds a handler function to the plugin, all handlers will be invoked 
     * accordingly when calling `apply()`.
     * @param handler If the handler return `false`, it will force to quit 
     *  calling the remaining handlers.
     */
    bind(handler: (input: I, output?: O) => false | void | [I, O] | Promise<false | void | [I, O]>): this;

    /**
     * Runs all the handlers in the plugin and apply them to the `input` and 
     * `output` objects.
     * @param output Sets the default output object and prevent using the one 
     *  created from `inputType`.
     */
    apply(input: I, output?: O): Promise<O>;
}

export default AsyncPlugin;