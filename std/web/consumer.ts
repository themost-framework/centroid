import { HttpContext } from "./context.ts";

export class HttpResult {
    //
}

export class HttpNextResult extends HttpResult {

}

export class HttpEndResult extends HttpResult {

}

export class HttpErrorResult extends HttpResult {
    public error: Error;
    constructor(error: Error) {
        super();
        this.error = error;
    }
}

export class HttpConsumer {
    private _handler: (context: HttpContext) => Promise<any>;
    constructor(handler: (context: HttpContext) => Promise<any>) {
        this._handler = handler;
    }
    /**
     * Execute handler against a server request
     * @param req 
     */
    async run(context: HttpContext): Promise<any> {
        return await this._handler(context);
    }
}
