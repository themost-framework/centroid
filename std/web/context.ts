// MOST Web Framework Centroid for Deno Copyright (c) 2020, THEMOST LP All rights reserved BSD-3-Clause license
import { Context } from "../common/context.ts";
import { ServerRequest, Response } from "https://deno.land/std/http/server.ts";
import { HttpNextResult, HttpEndResult } from "./signals.ts";
import { HttpActivatedRoute } from "./router.ts";
import { HttpRequest } from "./request.ts";
export class HttpContext extends Context {
    public request: HttpRequest;
    public response: Response;
    public route?: HttpActivatedRoute;
    public body: any | null;
    constructor(req: ServerRequest) {
        super();
        // set context request
        this.request = req;
        // set context response
        this.response = {
            headers: new Headers()
        };
    }

    next() {
        return new HttpNextResult();
    }
    end() {
        return new HttpEndResult();
    }
}