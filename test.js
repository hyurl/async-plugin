"use strict";

const assert = require("assert");
const AsyncPlugin = require(".").default;

describe("create and apply an async plugin", () => {
    it("should create an async plugin as expected", () => {
        let plugin = new AsyncPlugin();
        let plugin2 = new AsyncPlugin(Buffer, Promise);

        assert.strictEqual(plugin.inputType, Object);
        assert.strictEqual(plugin.outputType, Object);
        assert.strictEqual(plugin2.inputType, Buffer);
        assert.strictEqual(plugin2.outputType, Promise);
    });

    it("should bind and apply a handler function to a plugin as expected", (done) => {
        let plugin = new AsyncPlugin({}, {});
        let obj = {};

        plugin.bind((input, output) => {
            return Promise.resolve().then(() => {
                output.name = input.name || "Ayon Lee";
            });
        });

        plugin.apply(obj).then((output) => {
            assert.deepStrictEqual(output, { name: "Ayon Lee" });
        }).then(done).catch(done);
    });

    it("should bind and apply multiple handler functions to a plugin as expected", (done) => {
        let plugin = new AsyncPlugin();
        let obj = {
            name: "Ayon Lee",
            email: "i@hyurl.com"
        };

        plugin.bind((input, output) => {
            return Promise.resolve().then(() => {
                output.name = input.name;
                return [input, output];
            });
        }).bind((input, output) => {
            return Promise.resolve().then(() => {
                output.email = input.email;
                return [input, output];
            });
        });

        plugin.apply(obj, { timezone: "Asia/Shanghai" }).then((output) => {
            assert.deepStrictEqual(output, {
                name: "Ayon Lee",
                email: "i@hyurl.com",
                timezone: "Asia/Shanghai"
            });
        }).then(done).catch(done);
    });
});