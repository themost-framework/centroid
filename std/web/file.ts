

import { HttpConsumer } from "./consumer.ts";
import { ServerRequest } from "https://deno.land/std/http/server.ts";
import { posix, extname } from "https://deno.land/std/path/mod.ts";

export class HttpFileConsumer extends HttpConsumer {
    constructor(dir: string) {
        super(async (req: ServerRequest) => {
            // get request url
            let normalizedUrl = posix.normalize(req.url);
            // try to decode
            try {
                normalizedUrl = decodeURIComponent(normalizedUrl);
            }
            catch (err) {
                if (!(err instanceof URIError)) {
                    throw err;
                }
            }
            const fsPath = posix.join(, normalizedUrl);
        });
    }
}
