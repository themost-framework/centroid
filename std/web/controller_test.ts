import {
   assert,
   assertEquals
} from "https://deno.land/std/testing/asserts.ts";
import { httpGet, HttpAction, httpPost, httpPut, httpPatch, httpHead, httpOptions, httpAny, HttpController } from './controller.ts';
import { HttpNextResult, HttpEndResult } from "./signals.ts";

const { test } = Deno;

test("httpGet()", async function (): Promise<void> {
   class TestGetController {
      @httpGet()
      index() {
         return 'Hello World';
      }
   }
   assertEquals((<HttpAction>TestGetController.prototype.index).httpGet, true);
});
test("httpPost()", async function (): Promise<void> {
   class TestPostController {
      @httpPost()
      update() {
         return {
            status: 'updated'
         };
      }
   }
   assertEquals((<HttpAction>TestPostController.prototype.update).httpPost, true);
   assertEquals((<HttpAction>TestPostController.prototype.update).httpGet, undefined);
});

test("httpPut()", async function (): Promise<void> {
   class TestPutController {
      @httpPut()
      insert() {
         return {
            status: 'inserted'
         };
      }
   }
   assertEquals((<HttpAction>TestPutController.prototype.insert).httpPut, true);
});

test("httpPatch()", async function (): Promise<void> {
   class TestPatchController {
      @httpPatch()
      update() {
         return {
            status: 'updated'
         };
      }
   }
   assertEquals((<HttpAction>TestPatchController.prototype.update).httpPatch, true);
});

test("httpHead()", async function (): Promise<void> {
   class TestHeadController {
      @httpHead()
      @httpGet()
      index() {
         //
      }
   }
   assertEquals((<HttpAction>TestHeadController.prototype.index).httpHead, true);
   assertEquals((<HttpAction>TestHeadController.prototype.index).httpGet, true);
});

test("httpOptions()", async function (): Promise<void> {
   class TestHeadController {
      @httpHead()
      @httpOptions()
      @httpGet()
      index() {
         //
      }
   }
   assertEquals((<HttpAction>TestHeadController.prototype.index).httpOptions, true);
   assertEquals((<HttpAction>TestHeadController.prototype.index).httpGet, true);
});

test("httpAny()", async function (): Promise<void> {
   class TestHeadController {
      @httpAny()
      index() {
         //
      }
   }
   const method = (<HttpAction>TestHeadController.prototype.index);
   assertEquals(method.httpOptions, true);
   assertEquals(method.httpGet, true);
   assertEquals(method.httpPost, true);
   assertEquals(method.httpPut, true);
   assertEquals(method.httpDelete, true);
   assertEquals(method.httpPatch, true);
   assertEquals(method.httpHead, true);
});

test("HttpController.next()", async function (): Promise<void> {
   class TestController1 extends HttpController {
      @httpAny()
      handle() {
         return this.next();
      }
   }
   const result = new TestController1().handle();
   assert(result instanceof HttpNextResult);
});

test("HttpController.end()", async function (): Promise<void> {
   class TestController2 extends HttpController {
      @httpAny()
      handle() {
         return this.end();
      }
   }
   const result = new TestController2().handle();
   assert(result instanceof HttpEndResult);
});