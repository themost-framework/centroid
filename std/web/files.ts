// MOST Web Framework Centroid for Deno Copyright (c) 2020, THEMOST LP All rights reserved BSD-3-Clause license
import { HttpConsumer } from "./consumer.ts";
import { HttpNextResult, HttpErrorResult } from "./httpResults.ts";
import { posix, extname } from "https://deno.land/std/path/mod.ts";
import { HttpContext } from "./context.ts";
import { MediaTypeProvider } from "./mediaTypeProvider.ts";
import { HttpUnsupportedMediaError } from "../common/mod.ts";
const { stat, open } = Deno;
export declare interface FileConsumerOptions {
    /**
     * Defines the default response for a directory e.g. pages/ => pages/index.html
     */
    index?: string;
}
export class HttpFileConsumer extends HttpConsumer {
    constructor(directory: string, options?: FileConsumerOptions) {
        const defaults = Object.assign({
            index: 'index.html'
        }, options);
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
            let filePath = posix.join(directory, normalizedUrl);
            try {
                let stats = await stat(filePath);
                if (stats.isDirectory) {
                    // get index file
                    filePath = posix.join(filePath, defaults.index);
                    stats = await stat(filePath);
                }
                if (stats.isFile) {
                    const fileExtension = extname(filePath);
                    const contentType = context.application.getService(MediaTypeProvider).resolve(fileExtension);
                    if (contentType == null) {
                        // throw exception for missing content type
                        // (not allowed ?)
                        throw new HttpUnsupportedMediaError(); 
                    }
                    context.response.body = await open(filePath);
                    context.response.headers?.append(
                        "content-length", stats.size.toString()
                    )
                    context.response.headers?.append(
                        "content-type", contentType
                    );
                    return context.end();
                } else {
                    return context.next();
                }
            }
            catch (error) {
                // file cannot be found, so continue
                if (error.name === "NotFound") {
                    return context.next();
                }
                throw error;
            }
        });
    }
}
