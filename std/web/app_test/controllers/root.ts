import { httpController, HttpController, httpGet, httpAction } from "../../controller.ts";
import { HttpApplication } from "../../app.ts";

@httpController('.')
export class RootController extends HttpController {
    @httpGet()
    @httpAction('index')
    index() {
        return this.content(`<h2>Hello World</h2>`);
    }
}