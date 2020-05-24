import  { ServerRequest } from 'https://deno.land/std/http/server.ts';

export class HttpResult {
    //
}

export class HttpNextResult extends HttpResult {

}

export class HttpEndResult extends HttpResult {

}

export class HttpConsumer {
    private _handler: (req: ServerRequest) => Promise<any>;
    constructor(handler: (req: ServerRequest) => Promise<any>) {
        this._handler = handler;
    }
    /**
     * Execute handler against a server request
     * @param req 
     */
    async run(req: ServerRequest): Promise<any> {
        return await this._handler(req);
    }
}