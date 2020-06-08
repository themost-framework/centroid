// MOST Web Framework Centroid for Deno Copyright (c) 2020, 
// THEMOST LP All rights reserved BSD-3-Clause license
import { HttpContext } from "./context.ts";
import { Response } from "https://deno.land/std/http/server.ts";
import { HttpEndResult } from "./signals.ts";
/**
 * Represents a generic http result
 */
export class HttpResult {
    public contentType: string = "text/html";
    public readonly data: any;
    public readonly headers: any = new Headers();
    constructor(data?: any) {
        this.data = data;
    }
    /**
     * Sets an extra header that is going to added in response
     * @param {string} name 
     * @param {string} value 
     */
    header(name: string, value: string): this {
        this.headers.set(name, value);
        return this;
    }
    /**
     * Enables processing of the result
     * @param context 
     */
    async execute(context: HttpContext): Promise<HttpEndResult> {
        // if data is not defined or null
        if (this.data == null) {
            // set empty response
            context.response = <Response> {
                status: 204,
                headers: this.headers
            }
            return context.end();
        }
        // otherwise build headers
        // todo: control body type
        let body = this.data;
        let headers = this.headers;
        let status = 200;
        if (this.contentType) {
            headers.set("content-type", this.contentType);
        }
        // and set context
        context.response = <Response> {
            status,
            headers,
            body
        }
        return context.end();
    }
}
/**
 * Represents an empty response with status 204 No Content
 */
export class HttpEmptyResponse extends HttpResult {
    constructor() {
        super();
    }
    async execute(context: HttpContext): Promise<HttpEndResult> {
        context.response = <Response> {
            status: 204,
            headers: this.headers
        }
        return context.end();
    }
}

export class HttpContentResult extends HttpResult {
    constructor(data: string) {
        super(data);
    }
}

export class HttpJsonResult extends HttpResult {
    constructor(data: any) {
        super(data);
        this.contentType = "application/json";
    }
    async execute(context: HttpContext): Promise<HttpEndResult> {
        // if data is not defined or null
        if (this.data == null) {
            return await (new HttpEmptyResponse().execute(context));
        }
        // otherwise build headers
        let body;
        // if data has toJSON() method
        if (typeof this.data.toJSON === 'function') {
            body = this.data.toJSON();
        } else {
            // otherwise use JSON.stringify
            body = JSON.stringify(this.data);
        }
        let headers = this.headers;
        let status = 200;
        if (this.contentType) {
            headers.set("content-type", this.contentType);
        }
        headers.set("content-length", body.length);
        // and set context
        context.response = <Response> {
            status,
            headers,
            body
        }
        return context.end();
    }
}

export class HttpXmlResult extends HttpResult {
    constructor(data: any) {
        super(data);
        this.contentType = "application/xml";
    }
}