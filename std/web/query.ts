import { HttpConsumer } from "./consumer.ts";
import { HttpContext } from "./context.ts";
/**
 * Parses request URL querystring
 */
export class QuerystringConsumer extends HttpConsumer {
    constructor() {
        super(async (context: HttpContext) => {
            const searchParams = new URL(context.request.url, "https://0.0.0.0").searchParams;
            context.request.query = Object.fromEntries(searchParams);
            return context.next();
        });
    }
}