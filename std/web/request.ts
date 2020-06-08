// MOST Web Framework Centroid for Deno Copyright (c) 2020, 
// THEMOST LP All rights reserved BSD-3-Clause license
import { ServerRequest, Response } from "https://deno.land/std/http/server.ts";
export declare interface HttpRequest extends ServerRequest {
    query?: any;
}