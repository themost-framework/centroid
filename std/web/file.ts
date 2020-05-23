

import { HttpConsumer } from "./consumer.ts";
import { ServerRequest } from "https://deno.land/std/http/server.ts";

export class HttpFileConsumer extends HttpConsumer {
    constructor() {
        super(async (req: ServerRequest) => {
            // put code here for files
        });
    }
}
