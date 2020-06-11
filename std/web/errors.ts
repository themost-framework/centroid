import { HttpContext } from "./context.ts";
import { Response } from "https://deno.land/std/http/server.ts";
/**
 * Defines an error handler for catching errors and generating an acceptable response
 */
export class HttpErrorHandler {
    private readonly _handler: (context: HttpContext, error: any) => Promise<Response>;
    constructor(handler: (context: HttpContext, error: any) => Promise<Response>) {
        this._handler = handler;
    }
    /**
     * Execute handler against a server request
     * @param context
     * @param error
     */
    async run(context: HttpContext, error: any): Promise<void> {
        // execute handler
        const response = await this._handler(context, error);
        // and respond with the generated response
        return context.request.respond(response);
    }
}
/**
 * The default error handler of an HttpApplication
 */
export class DefaultErrorHandler extends HttpErrorHandler {
    constructor() {
        super(async (context, error) => {
            return {
                status: error.statusCode || 500,
                body: `${error.statusCode || 500} ${error.message}`
            };
        });
    }
    
}