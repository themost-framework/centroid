import {
    equal,
    assert,
    assertEquals,
    assertMatch,
    assertStrContains,
    assertThrowsAsync
  } from "https://deno.land/std/testing/asserts.ts";
  import {HttpApplication} from './app.ts';
  
  const { test } = Deno;

  test("new HttpApplication()", async function (): Promise<void> {
    const app = new HttpApplication();
  });
  test("HttpApplication.serve()", async function (): Promise<void> {
    const app = new HttpApplication();
    await app.serve({ port: 8000 });
  });