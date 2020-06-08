import {
    assert,
    assertEquals,
    assertThrows
 } from "https://deno.land/std/testing/asserts.ts";
 import { Application, ApplicationService } from "../../std/common/mod.ts";
 
 const { test } = Deno;
 class MyApplication extends Application {
    //
 }

 class Service1 extends ApplicationService {
     constructor(container: Application) {
         super(container);
     }
 }

 class Strategy1 extends Service1 {
    constructor(container: Application) {
        super(container);
    }
}

 class Service2 extends ApplicationService {
    constructor(container: Application) {
        super(container);
    }
}

 test("new Application()", async function (): Promise<void> {
   const app = new MyApplication();
    assert(app instanceof Application);
 });

 test("Application.useService()", async function (): Promise<void> {
     const app = new MyApplication();
     app.useService(Service1);
     assertEquals(app.hasService(Service1), true);
 });

 test("Application.getService()", async function (): Promise<void> {
    const app = new MyApplication();
    app.useService(Service1);
    const service = app.getService(Service1);
    assert(service instanceof Service1);
    assertEquals(app.getService(Service2), undefined);
});

 test("Application.hasService()", async function (): Promise<void> {
    const app = new MyApplication();
    app.useService(Service1);
    assertEquals(app.hasService(Service1), true);
    assertEquals(app.hasService(Service2), false);
});

test("Application.useStrategy()", async function (): Promise<void> {
    const app = new MyApplication();
    app.useStrategy(Service1, Strategy1);
    assertEquals(app.hasService(Service1), true);
    const service = app.getService(Service1);
    assert(service instanceof Strategy1);
    assert(service instanceof Service1);
});