// MOST Web Framework Centroid for Deno Copyright (c) 2020, THEMOST LP All rights reserved BSD-3-Clause license
import { HttpConsumer } from "./consumer.ts";
import { HttpContext } from "./context.ts";
export class HttpCorsConsumer extends HttpConsumer {
    constructor() {
        super(async (context: HttpContext) => {
            if (context.response.headers == null) {
                context.response.headers = new Headers();
            }
            context.response.headers.append("access-control-allow-origin", "*");
            context.response.headers.append(
            "access-control-allow-headers",
            "Origin, X-Requested-With, Content-Type, Accept, Range"
            );
        });
    }
}