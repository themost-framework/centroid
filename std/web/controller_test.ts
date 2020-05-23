import {
    equal,
    assert,
    assertEquals,
    assertMatch,
    assertStrContains,
    assertThrowsAsync
  } from "https://deno.land/std/testing/asserts.ts";
  import {httpGet, HttpAction} from './controller.ts';
  
  const { test } = Deno;

  test("httpGet", async function (): Promise<void> {
     class TestGetController {
        @httpGet()
        index() {
            return 'Hello World';
        }
     }
     assertEquals((<HttpAction>TestGetController.prototype.index).httpGet, true);
  });
