import  { serve, listenAndServe, ServerRequest, HTTPOptions } from 'https://deno.land/std/http/server.ts';
import { HttpConsumer } from "./consumer.ts";
import { HttpNextResult } from "./signals.ts";
import { Application } from "../common/app.ts";
import { MediaTypeProvider } from './mediaTypeProvider.ts';
import { HttpContext } from './context.ts';
import { HttpNotFoundError } from '../common/mod.ts';
import { DefaultErrorHandler, HttpErrorHandler } from './errorHandler.ts';

export class HttpApplication extends Application  {
    private _consumers: Array<HttpConsumer> = [];
    private _handlers: Array<HttpErrorHandler> = [];
    private readonly _errorHandler = new DefaultErrorHandler();
    constructor() {
        super();
        // register core services
        this.useService(MediaTypeProvider);
    }
    /**
     * Defines an http consumer for handling http requests
     * @param {HttpConsumer} consumer 
     */
    use(consumer: HttpConsumer) {
        // add consumer
        this._consumers.push(consumer);
    }

    /**
     * Defines an http handler for handling errors
     * @param {HttpConsumer} handler
     */
    handle(handler: HttpErrorHandler) {
        // add error handler
        this._handlers.push(handler);
    }

    async serve(addr: string | HTTPOptions) {
        await listenAndServe(addr, async (req: ServerRequest) => {
            // fallback consumer
            if (this._consumers.length === 0) {
                return req.respond({
                    body: `MOST Web Framework Centroid`
                });
            }
            // create context
            const context = new HttpContext(req);
            context.application = this;
            try {
                for (let consumer of this._consumers) {
                    const result = await consumer.run(context);
                    if (!(result instanceof HttpNextResult)) {
                        return req.respond(context.response);
                    }
                }
            } catch(err) {
                return this._errorHandler.run(context, err);
            }
            return this._errorHandler.run(context, new HttpNotFoundError());
        });
    }
    async stop() {
        //
    }
}