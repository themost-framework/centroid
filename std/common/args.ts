// MOST Web Framework Centroid for Deno Copyright (c) 2020,
// THEMOST LP All rights reserved BSD-3-Clause license
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
     * Validates if the given expression is true. Otherwise throws an ArgumentError exception.
     * @param expr The expression that is going to be validated
     * @param message The error message
     * @param code A code that identifies the error that is going to be thrown e.g. E_INVALID
     */
    public static check(expr: boolean, message: string, code?: string): void {
        if (!expr) {
            throw new ArgumentError(message, code);
        }
    }

    /**
     * Validates if the given parameter is not null or undefined. Otherwise throws an ArgumentError exception.
     * @param {*} obj The value that is going to be validated
     * @param {string} name A string which represents the name of the variable
     */
    public static notNull(obj: any, name: string): void {
        Args.check(obj != null, `${name} may not be null or undefined`, 'E_NULL');
    }

    /**
     * Validates if the given parameter is not an empty string. Otherwise throws an ArgumentError exception.
     * @param {string} obj  A string value that is going to be validated
     * @param {string} name A string which represents the name of the variable
     */
    public static notEmpty(obj: string, name: string): void {
        Args.check((obj != null) && (obj.length > 0), `${name} may not be empty`, 'E_NULL');
    }

    /**
     * Validates if the given parameter is not a negative number. Otherwise throws an ArgumentError exception.
     * @param {number} obj The value that is going to be validated
     * @param {string} name A string which represents the name of the variable
     */
    public static notNegative(obj: number, name: string): void {
        Args.check((typeof obj === 'number'), `${name} may be a number`, 'E_NUMBER');
        Args.check((obj >= 0), `${name} may not be negative`, 'E_NUMBER');
    }
    /**
     * Validates if the given parameter is a positive number. Otherwise throws an ArgumentError exception.
     * @param {number} obj The number that is going to be validated
     * @param {string} name A string which represents the name of the variable
     */
    public static positive(obj: number, name: string): void {
        Args.check((typeof obj === 'number'), `${name} may be a number`, 'E_NUMBER');
        Args.check((obj > 0), `${name} must be a positive number`, 'E_NUMBER');
    }

}