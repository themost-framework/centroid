// MOST Web Framework Centroid for Deno Copyright (c) 2020, THEMOST LP All rights reserved BSD-3-Clause license
import { HttpConsumer, HttpNextResult, HttpErrorResult } from "./consumer.ts";
import {FileConsumerOptions} from "./fileConsumer.ts";
import {HttpContext} from "./context.ts";
export declare interface ControllerConsumerOptions {
    dir?: string
}
export class HttpControllerConsumer extends HttpConsumer {
    constructor(options?: ControllerConsumerOptions) {
        const defaults = Object.assign({
            dir: 'controllers'
        }, options);
        super(async (context: HttpContext) => {
            //
        });
    }
}