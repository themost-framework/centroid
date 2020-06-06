import {HttpApplication, HttpRouter} from '../mod.ts';
import { HttpCorsConsumer } from '../cors.ts';
import { HttpControllerConsumer } from '../controllerConsumer.ts';

const app = new HttpApplication();
// use cors
app.use(new HttpCorsConsumer());
// use controller
app.use(new HttpControllerConsumer());
// use router service
app.useService(HttpRouter);