import {
    assert,
    assertEquals
 } from "https://deno.land/std/testing/asserts.ts";
 import { LangUtils } from "../../std/common/mod.ts";

 const { test } = Deno;

 test("LangUtils.getFunctionArgumentNames()",  async function (): Promise<void> {
    
    function func1(a: number, b: number): number {
        return a * b;
    }

    let result = LangUtils.getFunctionArgumentNames(func1);
    assert(result);
    assert(result instanceof Array);
    assertEquals(result[0], "a");

    async function func2(a: number, b: number): Promise<number> {
        return a * b;
    }

    result = LangUtils.getFunctionArgumentNames(func2);
    assert(result);
    assert(result instanceof Array);
    assertEquals(result[0], "a");

    class ClassA {
        func1(a: number, b: number): number {
            return a * b;
        }
    }
    const obj = new ClassA();
    result = LangUtils.getFunctionArgumentNames(obj.func1);
    assert(result);
    assert(result instanceof Array);
    assertEquals(result[0], "a");

});
test("LangUtils.isDate()",  async function (): Promise<void> {
    assert(LangUtils.isDate(new Date()));
    assert(LangUtils.isDate('2020-06-01'));
    assert(LangUtils.isDate('2020-06-01T12:45:00Z'));
});