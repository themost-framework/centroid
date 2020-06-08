import {
    assertThrows
 } from "https://deno.land/std/testing/asserts.ts";
 import { Args } from "../../std/common/mod.ts";
 
 const { test } = Deno;

 test("Args.notNull()", async function (): Promise<void> {
     assertThrows(() => {
         let var1 = null;
         Args.notNull(var1, 'variable1');
     });
     assertThrows(() => {
        let var1 = undefined;
        Args.notNull(var1, 'variable1');
     });
     let var2 = 2;
     Args.notNull(var2, 'var2');
 });

 test("Args.notEmpty()", async function (): Promise<void> {
    assertThrows(() => {
        let var1 = '';
        Args.notEmpty(var1, 'var1');
    });
    let var2 = 'test';
    Args.notEmpty(var2, 'var2');
});

test("Args.notNegative()", async function (): Promise<void> {
    assertThrows(() => {
        let var1 = -1;
        Args.notNegative(var1, 'var1');
    });
    let var2 = 1;
    Args.notNegative(var2, 'var2');
});

test("Args.check()", async function (): Promise<void> {
    assertThrows(() => {
        let var1 = -1;
        Args.check(var1 >= 0, 'var1');
    });
    let var2 = 1;
    Args.check(var2 >= 0, 'var2');
});

test("Args.positive()", async function (): Promise<void> {
    assertThrows(() => {
        let var1 = -1;
        Args.positive(var1, 'var1');
    });
    let var2 = 1;
    Args.positive(var2, 'var2');
});