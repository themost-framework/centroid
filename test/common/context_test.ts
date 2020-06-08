import {
    assert
 } from "https://deno.land/std/testing/asserts.ts";
 import { ApplicationConfiguration, Application, Context } from "../../std/common/mod.ts";

const { test } = Deno;

class MyApplication extends Application {
    constructor() {
        super();
    }
}

class MyContext extends Context {

}

test("Context",  async function (): Promise<void> {
    const app = new MyApplication();
    const context = new MyContext();
    context.application = app;
    assert(context);
    assert(context.application instanceof MyApplication);
});