import {
    assert,
    assertEquals
 } from "https://deno.land/std/testing/asserts.ts";
import { QuerystringConsumer } from "../../std/web/query.ts";
import { HttpContext } from "../../std/web/mod.ts";
import { ServerRequest } from "https://deno.land/std/http/server.ts";
 const { test } = Deno;

 test("QuerystringConsumer", async function (): Promise<void> {
     
    const consumer = new QuerystringConsumer();
    const req = new ServerRequest();
    req.url = "/users/?$filter=name eq 'alexis.rees'";
    let context = new HttpContext(req);
    await consumer.run(context);
    assert(context.request.query);
    assertEquals(context.request.query.$filter, "name eq 'alexis.rees'");

    req.url = "/users/";
    context = new HttpContext(req);
    await consumer.run(context);
    assert(context.request.query);
    assertEquals(Object.keys(context.request.query).length, 0, "Expected empty query");

    req.url = "/users/?item=orange&item=apple";
    context = new HttpContext(req);
    await consumer.run(context);
    assert(context.request.query);
    assertEquals(context.request.query.item, "apple");


});