// MOST Web Framework Centroid for Deno Copyright (c) 2020, THEMOST LP All rights reserved BSD-3-Clause license
import { HttpConsumer, HttpNextResult, HttpErrorResult } from "./consumer.ts";
import { posix, extname } from "https://deno.land/std/path/mod.ts";
import { HttpContext } from "./context.ts";
import { MediaTypeProvider } from "./mediaTypeProvider.ts";
const { stat, open } = Deno;
export class HttpFileConsumer extends HttpConsumer {
    constructor(directory: string) {
        super(async (context: HttpContext) => {
            // get request url
            let normalizedUrl = posix.normalize(context.request.url);
            // try to decode
            try {
                normalizedUrl = decodeURIComponent(normalizedUrl);
            }
            catch (err) {
                if (!(err instanceof URIError)) {
                    throw err;
                }
            }
            const filePath = posix.join(directory, normalizedUrl);
            try {
                const stats = await stat(filePath);
                if (stats.isFile) {
                    const fileExtension = extname(filePath);
                    const contentType = context.application.getService(MediaTypeProvider).resolve(fileExtension);
                    if (contentType == null) {
                        // throw exception for missing content type
                        // (not allowed ?)
                        throw new Error(); 
                    }
                    context.response.body = await open(filePath);
                    context.response.headers?.append(
                        "content-length", stats.size.toString()
                    )
                    context.response.headers?.append(
                        "content-type", "application/octet-stream"
                    );
                } else {
                    return new HttpNextResult();
                }
            }
            catch (error) {
                return new HttpErrorResult(error);
            }
        });
    }
}
