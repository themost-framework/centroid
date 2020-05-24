/**
 * MOST Web Framework Centroid for Deno
 * Copyright (c) 2020, THEMOST LP All rights reserved
 *
 * Use of this source code is governed by an BSD-3-Clause license that can be
 * found in the LICENSE file at https://themost.io/license
 */
/**
 * Represents an argument error
 */
export class ArgumentError extends Error {
    public code = 'E_ARG';
    constructor(message: string, code?: string) {
        super(message);
        if (code) {
            this.code = code;
        }
    }
}
/**
 * Provides a set of helpers for validating arguments and variables
 */
export class Args {

    /**
     * 
     * @param expr 
     * @param message 
     * @param code 
     */
    public static check(expr: boolean, message: string, code?: string): void {
        if (!expr) {
            throw new ArgumentError(message, code);
        }
    }

    public static notNull(obj: any, name: string): void {
        Args.check(obj != null, `${name} may not be null or undefined`, 'E_NULL');
    }

    public static notEmpty(obj: string, name: string): void {
        Args.check((obj != null) && (obj.length > 0), `${name} may not be empty`, 'E_NULL');
    }

    public static notNegative(obj: number, name: string): void {
        Args.check((typeof obj === 'number'), `${name} may be a number`, 'E_NUMBER');
        Args.check((obj >= 0), `${name} may not be negative`, 'E_NUMBER');
    }

    public static positive(obj: number, name: string): void {
        Args.check((typeof obj === 'number'), `${name} may be a number`, 'E_NUMBER');
        Args.check((obj > 0), `${name} must be a positive number`, 'E_NUMBER');
    }

}