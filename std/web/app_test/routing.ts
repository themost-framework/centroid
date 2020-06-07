import { HttpRoute } from "../router.ts";
import { RootController } from "./controllers/root.ts";

const APP_ROUTES: Array<HttpRoute> = [
    {
        path: "",
        controller: RootController,
        children: [
            {
                path: "",
                controller: RootController,
                pathMatch: "full",
                redirectTo: "index"
            },
            {
                controller: RootController,
                path: ":action"
            }
        ]
    }
];

export {
    APP_ROUTES
};