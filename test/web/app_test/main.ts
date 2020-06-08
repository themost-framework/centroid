import {HttpApplication, HttpRouter, CorsConsumer, ControllerConsumer, JsonConsumer} from '../../../std/web/mod.ts';
import { APP_ROUTES } from './routing.ts';

const app = new HttpApplication();
// use cors
app.use(new CorsConsumer());
// use json parser
app.use(new JsonConsumer());
// use controller
app.use(new ControllerConsumer());
// use router service
app.useService(HttpRouter);
// add routes
app.getService(HttpRouter).routes(APP_ROUTES);

app.serve({ port: 8000 });