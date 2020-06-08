import {HttpApplication, FileConsumer} from '../../../std/web/mod.ts';

const app = new HttpApplication();
const publicDir = new URL("./public", import.meta.url).pathname;
app.use(new FileConsumer(publicDir));
app.serve({ port: 8000 });