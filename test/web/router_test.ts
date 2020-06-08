import {
    assert,
    assertEquals
 } from "https://deno.land/std/testing/asserts.ts";
import { HttpRouter, HttpApplication } from '../../std/web/mod.ts';
 const { test } = Deno;

 test("HttpRouter", async function (): Promise<void> {
     const app = new HttpApplication();
     const router = new HttpRouter(app);
     assert(router);
 });

 test("HttpRouter as service", async function (): Promise<void> {
    const app = new HttpApplication();
    app.useService(HttpRouter);
    assertEquals(app.getService(HttpRouter) instanceof HttpRouter , true);
});

test("HttpRouter.isMatch('/users/activate')", async function (): Promise<void> {
    const app = new HttpApplication();
    const router = new HttpRouter(app);
    let result = router.isMatch({
        path: '/users/:action',
        pathMatch: 'full'
    }, '/users/activate');
    assert(result);
    assertEquals(result.params.action, 'activate');
    result = router.isMatch({
        path: '/users/:action',
        pathMatch: 'prefix'
    }, '/users/activate/commit');
    assert(result);
});

test("HttpRouter.isMatch('/users/1001'", async function (): Promise<void> {
    const app = new HttpApplication();
    const router = new HttpRouter(app);
    let result = router.isMatch({
        path: '/users/{id:int}'
    }, '/users/1001');
    assert(result);
    assertEquals(result.params.id, 1001);
    result = router.isMatch({
        path: '/users/{id:int}'
    }, '/users/notNumber');
    assertEquals(result, undefined);
});

test("HttpRouter.isMatch(\"/api/users('alexis.rees')\"", async function (): Promise<void> {
    const app = new HttpApplication();
    const router = new HttpRouter(app);
    const result = router.isMatch({
        path: '/api/users\\({name:string}\\)'
    }, "/api/users('alexis.rees')");
    assert(result);
    assertEquals(result.params.name, 'alexis.rees');
});

test("HttpRouter.isMatch(\"/api/products/discount(10.55)\"", async function (): Promise<void> {
    const app = new HttpApplication();
    const router = new HttpRouter(app);
    const result = router.isMatch({
        path: '/api/products/discount\\({price:decimal}\\)'
    }, "/api/products/discount(10.55)");
    assert(result);
    assertEquals(result.params.price, 10.55);
});

test("HttpRouter.isMatch(\"/api/products/discount(101.55)\"", async function (): Promise<void> {
    const app = new HttpApplication();
    const router = new HttpRouter(app);
    const result = router.isMatch({
        path: '/api/products/discount\\({price:float}\\)'
    }, "/api/products/discount(101.55)");
    assert(result);
    assertEquals(result.params.price, 101.55);
});

test("HttpRouter.isMatch('/api/products/123e4567-e89b-12d3-a456-426652340000')", async function (): Promise<void> {
    const app = new HttpApplication();
    const router = new HttpRouter(app);
    const result = router.isMatch({
        path: '/api/products/{id:guid}'
    }, "/api/products/123e4567-e89b-12d3-a456-426652340000");
    assert(result);
    assertEquals(result.params.id, "123e4567-e89b-12d3-a456-426652340000");
});

test("HttpRouter.isMatch(\"/api/products/order('2020-06-01')\")", async function (): Promise<void> {
    const app = new HttpApplication();
    const router = new HttpRouter(app);
    const result = router.isMatch({
        path: '/api/products/order\\({orderDate:date}\\)'
    }, "/api/products/order('2020-06-01')");
    assert(result);
    assertEquals(result.params.orderDate, new Date('2020-06-01'));
});

test("HttpRouter.query('/users/activate')", async function (): Promise<void> {
    const app = new HttpApplication();
    const router = new HttpRouter(app);
    router.routes([
        {
            path: '/users/activate',
            pathMatch: 'full'
        }
    ]);
    let result = router.query( router.config, '/users/activate');
    assert(result);
    router.routes([
        {
            path: '/users/:action',
            pathMatch: 'full'
        }
    ]);
    result = router.query( router.config, '/users/activate');
    assert(result);
    assertEquals(result.params.action, 'activate');
    router.routes([
        {
            path: "/users",
            children: [
                {
                    path: ":action",
                    pathMatch: "full"
                }
            ]
        }
    ]);
    result = router.query( router.config, '/users/activate');
    assert(result);
    assertEquals(result.params.action, 'activate');
    result = router.query( router.config, '/users/activate');
    
    router.routes([
        {
            path: "",
            children: [
                {
                    path: "",
                    pathMatch: "full",
                    action: "index"
                },
                {
                    path: "users",
                    children: [
                        {
                            path: ":action"
                        }
                    ]
                }
            ]
        }
    ]);
    result = router.query( router.config, '/users/activate');
    assert(result);

    router.routes([
        {
            path: "",
            children: [
                {
                    path: "",
                    pathMatch: "full",
                    action: "index"
                },
                {
                    path: ":model",
                    children: [
                        {
                            path: ":action"
                        }
                    ]
                }
            ]
        }
    ]);
    result = router.query( router.config, '/users/activate');
    assert(result);
    assertEquals(result.params.model, "users");
    assertEquals(result.params.action, "activate");
});