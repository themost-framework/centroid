import {
    equal,
    assert,
    assertEquals,
    assertMatch,
    assertThrowsAsync
  } from "https://deno.land/std/testing/asserts.ts";
  import { posix } from "https://deno.land/std/path/mod.ts";
  import {HttpApplication} from './app.ts';
import { HttpFileConsumer } from "./files.ts";
  
  const { test, cwd } = Deno;

  test("new HttpApplication()", async function (): Promise<void> {
    const app = new HttpApplication();
  });
  test("HttpApplication.serve()", async function (): Promise<void> {
    const app = new HttpApplication();
    const publicDir = new URL("./app_test_public", import.meta.url).pathname;
    app.use(new HttpFileConsumer(publicDir));
    await app.serve({ port: 8000 });
  });