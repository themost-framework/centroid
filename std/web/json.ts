// MOST Web Framework Centroid for Deno Copyright (c) 2020, THEMOST LP All rights reserved BSD-3-Clause license
import { HttpConsumer } from "./consumer.ts";
import { HttpContext } from "./context.ts";
import { HttpLengthRequiredError, HttpError } from "../common/mod.ts";
const WRITE_REQUEST = [ "GET", "POST", "PUT", "PATCH", "DELETE" ];

export declare interface JsonConsumerOptions {
    limit: number;
}

export class JsonConsumer extends HttpConsumer {
    constructor(options?: JsonConsumerOptions) {
        const defaults = Object.assign({
            limit: 2048
        }, options);
        super(async (context: HttpContext) => {
            let contentType = context.request.headers.get("content-type");
            if (contentType !== "application/json") {
                return context.next();
            }
            if (WRITE_REQUEST.includes(context.request.method) === false) {
                return context.next();
            }
            if (context.request.contentLength == null) {
                throw new HttpLengthRequiredError();
            }
            if (context.request.contentLength > defaults.limit ** 1000) {
                // request entity too large
                throw new HttpError(413);
            }
            // read all
            const result = await Deno.readAll(context.request.body);
            // decode text
            const text = new TextDecoder("utf-8").decode(result);
            // set context body
            Object.defineProperty(context, 'body', {
                enumerable: false,
                configurable: true,
                writable: true,
                value: JSON.parse(text)
            });
            return context.next();
        });
    }
}