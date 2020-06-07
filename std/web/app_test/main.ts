import {HttpApplication, HttpRouter} from '../mod.ts';
import { HttpCorsConsumer } from '../cors.ts';
import { HttpControllerConsumer } from '../consumer.ts';
import { APP_ROUTES } from './routing.ts';

const app = new HttpApplication();
// use cors
app.use(new HttpCorsConsumer());
// use controller
app.use(new HttpControllerConsumer());
// use router service
app.useService(HttpRouter);
// add routes
app.getService(HttpRouter).routes(APP_ROUTES);

app.serve({ port: 8000 });