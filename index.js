"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const interceptAsync = require("function-intercepter").interceptAsync;

class AsyncPlugin {
    constructor(inputType, outputType) {
        this.handler = (input, output) => Promise.resolve([input, output]);
        this.inputType = typeof inputType == "function"
            ? inputType
            : ((inputType || {}).constructor || Object);
        this.outputType = typeof outputType == "function"
            ? outputType
            : ((inputType || {}).constructor || Object);
    }

    bind(handler) {
        this.handler = interceptAsync(this.handler).before(handler);
        return this;
    }

    apply(input, output) {
        return this.handler(
            input,
            output || Object.create(this.outputType.prototype)
        ).then((res) => {
            return res[1];
        });
    }
}

exports.default = exports.AsyncPlugin = AsyncPlugin;