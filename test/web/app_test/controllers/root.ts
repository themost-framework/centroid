import { httpController, HttpController, httpGet, httpAction, httpPost } from "../../../../std/web/controller.ts";

@httpController('.')
export class RootController extends HttpController {
    @httpGet()
    @httpAction('index')
    index() {
        return this.content(`<h2>Hello World</h2>`);
    }
    @httpGet()
    @httpAction('message')
    getMessage() {
        return this.json({
            "message": "Hello World!"
        });
    }
    @httpPost()
    @httpAction('message')
    async postMessage() {
        const body = this.context?.body;
        return this.json(body);
    }
}