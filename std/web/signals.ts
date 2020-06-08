// MOST Web Framework Centroid for Deno Copyright (c) 2020,
// THEMOST LP All rights reserved BSD-3-Clause license
/**
 * Indicates that request processing should go to next consumer
 */
export class HttpNextResult {

}
/**
 * Indicates that request processing should be ended
 */
export class HttpEndResult {

}
/**
 * Indicates that request processing returns an error
 */
export class HttpErrorResult {
    public readonly error: Error;
    constructor(error: Error) {
        this.error = error;
    }
}