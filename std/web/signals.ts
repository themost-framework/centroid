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