import {
    equal,
    assert,
    assertEquals,
    assertMatch,
    assertThrowsAsync
  } from "https://deno.land/std/testing/asserts.ts";
  import { posix } from "https://deno.land/std/path/mod.ts";
  import {HttpApplication, ControllerConsumer } from "../../std/web/mod.ts";
  const { test, cwd } = Deno;

  test("new ControllerConsumer()", async function (): Promise<void> {
    const consumer = new ControllerConsumer();
    assert(consumer);
  });
