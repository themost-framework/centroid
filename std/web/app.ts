import  { serve, listenAndServe, ServerRequest, HTTPOptions, Server } from 'https://deno.land/std/http/server.ts';
import { HttpConsumer } from "./consumer.ts";
import { HttpNextResult } from "./signals.ts";
import { Application } from "../common/app.ts";
import { MediaTypeProvider } from './mediaTypeProvider.ts';
import { HttpContext } from './context.ts';
import { HttpNotFoundError } from '../common/mod.ts';
import { DefaultErrorHandler, HttpErrorHandler } from './errors.ts';
import { QuerystringConsumer } from './query.ts';

export class HttpApplication extends Application  {
    private _consumers: Array<HttpConsumer> = [];
    private _handlers: Array<HttpErrorHandler> = [];
    private readonly _errorHandler = new DefaultErrorHandler();
    private _server?: Server;
    constructor() {
        super();
        // register core services
        this.useService(MediaTypeProvider);
        // register core consumers
        this.use(new QuerystringConsumer());
    }
    /**
     * Defines an http consumer for handling http requests
     * @param {HttpConsumer} consumer 
     */
    use(consumer: HttpConsumer): this {
        // add consumer
        this._consumers.push(consumer);
        return this;
    }

    /**
     * Defines an http handler for handling errors
     * @param {HttpErrorHandler} handler
     */
    catch(handler: HttpErrorHandler): this {
        // add error handler
        this._handlers.push(handler);
        return this;
    }

    /**
     * Serves application. Operation should be followed by a request handler
     * @param addr 
     */
    serve(addr: string | HTTPOptions): Server {
        this._server = serve(addr);
        return this._server;
    }

    /**
     * Serves application for a single test request.
     */
    async testServe() {
      const server = this.serve(":0");
      for await (const req of server) {
        await this.handle(req);
        server.close();
      }
    }

    /**
     * Gets current server network address info
     */
    get addr(): any {
        return this._server?.listener.addr;
    }

    /**
     * Gets current server uri
     */
    get serverUri(): any {
        if (this._server && this._server.listener) {
            return `http://${this._server?.listener.addr.hostname}:${this._server?.listener.addr.port}`;
        }
    }

    /**
     * Handles incoming requests
     * @param req 
     */
    async handle(req: ServerRequest) {
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
    };

    /**
     * Listen serve application
     * @param addr 
     */
    async listenAndServe(addr: string | HTTPOptions) {
        const server = this.serve(addr);
        for await (const req of server) {
            this.handle(req);
        }
    }
    async close() {
        if (this._server) {
            this._server.close();
        }
    }
}