import {
    equal,
    assert,
    assertEquals,
    assertMatch,
    assertThrowsAsync
  } from "https://deno.land/std/testing/asserts.ts";
  import { posix } from "https://deno.land/std/path/mod.ts";
  import {HttpApplication} from './app.ts';
import { HttpControllerConsumer } from "./consumer.ts";
  const { test, cwd } = Deno;

  test("new HttpControllerConsumer()", async function (): Promise<void> {
    const consumer = new HttpControllerConsumer();
    assert(consumer);
  });
