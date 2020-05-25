import  { serve, listenAndServe, ServerRequest, HTTPOptions } from 'https://deno.land/std/http/server.ts';
import { HttpConsumer } from './consumer.ts';
import { Application } from '../common/app.ts';
import {MediaTypeProvider} from './mediaTypes.ts';

export class HttpApplication extends Application  {
    private _consumers: Array<HttpConsumer> = [];
    constructor() {
        super();
        // register core services
        this.useService(MediaTypeProvider);
    }
    /**
     * Define an http consumer for handling http requests
     * @param {HttpConsumer} consumer 
     */
    use(consumer: HttpConsumer) {
        // add consumer
        this._consumers.push(consumer);
    }
    async serve(addr: string | HTTPOptions) {
        await listenAndServe(addr, (req: ServerRequest) => {
            // fallback consumer
            if (this._consumers.length === 0) {
                return req.respond({
                    body: `MOST Web Framework Centroid`
                });
            }
        });
    }
    async stop() {
        //
    }
}