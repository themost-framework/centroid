import {
    assert,
    assertEquals  } from "https://deno.land/std/testing/asserts.ts";
  import {HttpApplication} from "../../std/web/mod.ts";
  
  const { test } = Deno;

  test("new HttpApplication()", async function (): Promise<void> {
  });

  test("HttpApplication.serve()", async function (): Promise<void> {
    const app = new HttpApplication();
    const p = app.testServe();
    let response = await fetch(new URL('/message', app.serverUri));
    assert(response.ok === false);
    assertEquals(response.status, 404);
    // important response should be read or closed to avoid resource leaks
    await response.body?.cancel();
    await p;
  });