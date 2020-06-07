// MOST Web Framework Centroid for Deno Copyright (c) 2020, THEMOST LP All rights reserved BSD-3-Clause license
import { posix } from "https://deno.land/std/path/mod.ts";
import {HttpContext} from "./context.ts";
import { HttpController } from "./controller.ts";
import { HttpRouter, HttpRoute, HttpActivatedRoute } from "./router.ts";
import { Args } from "../common/mod.ts";
import { HttpResult } from "./results.ts";

function capitalize(s: string) {
    if (s == null) {
        return;
    }
    return s.charAt(0).toUpperCase() + s.slice(1)
}
  

export class HttpConsumer {
    private _handler: (context: HttpContext) => Promise<any>;
    constructor(handler: (context: HttpContext) => Promise<any>) {
        this._handler = handler;
    }
    /**
     * Execute handler against a server request
     * @param req 
     */
    async run(context: HttpContext): Promise<any> {
        return await this._handler(context);
    }
}

export declare interface ControllerConsumerOptions {
    dir?: string
}
export class HttpControllerConsumer extends HttpConsumer {
    constructor(options?: ControllerConsumerOptions) {
        const defaults = Object.assign({
            dir: 'controllers'
        }, options);
        super(async (context: HttpContext) => {
            // get router service
            let router = context.application.getService(HttpRouter);
            if (router == null) {
                context.application.useService(HttpRouter);
                router = context.application.getService(HttpRouter);
            }
            // get normalized url
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
            // search routes router configuration for a mathing route
            context.route = router.query(router.config, normalizedUrl);
            // if there is no matching route
            if (context.route == null) {
                // continue
                return context.next();
            }
            // get controller constructor
            const ControllerCtor = context.route.routeConfig.controller;
            // if controller is not defined
            if (ControllerCtor == null) {
                // do nothing
                return context.next();
            }
            if (ControllerCtor) {
                const currentController = new ControllerCtor();
                // set context
                currentController.context = context;
                // get controller action
                const controllerAction = HttpControllerConsumer.queryControllerAction(currentController, context.route.params.action);
                // if controller action cannot be found
                if (controllerAction == null) {
                    // do nothing
                    return context.next();
                }
                // finally execute controller action
                const result = 
                await controllerAction.bind(currentController)();
                // if result is an instance of http result
                if (result instanceof HttpResult) {
                    return await result.execute(context);
                }
                return result;
            }
            
        });
    }

    private static isValidControllerAction(controller: HttpController, action: string): boolean {
        if (controller.context == null) {
            throw new Error("Controller context may nor be null");
        }
        let httpMethod = controller.context.request.method.toLowerCase();
        let httpMethodDecorator = `http${capitalize(httpMethod)}`;
        if (Object.prototype.hasOwnProperty.call(controller, action)) {
            // get action method
            const actionMethod = (controller as any)[action];
            if (actionMethod == null) {
                return false;
            }
            //get httpAction decorator
            if (actionMethod.httpAction != null) {
                //return this action
                return Object.prototype.hasOwnProperty.call(actionMethod, httpMethodDecorator);
            }
        }
        return false;
    }

    private static getControllerPropertyNames(controller: any) {
        if (controller == null) {
            return [];
        }
        let ownPropertyNames: Array<string> = [];
        //get object methods
        let proto = controller;
        while(proto) {
            ownPropertyNames = ownPropertyNames.concat(Object.getOwnPropertyNames(proto).filter( function(x) {
                return ownPropertyNames.indexOf(x)<0;
            }));
            proto = Object.getPrototypeOf(proto);
        }
        return ownPropertyNames;
    }

    public static queryControllerAction(controller: HttpController, action: string) {
        if (controller.context == null) {
            throw new Error("Controller context may nor be null");
        }
        let httpMethod = controller.context.request.method.toLowerCase();
        let httpMethodDecorator = `http${capitalize(httpMethod)}`;
        // get controller prtotype
        const controllerPrototype = Object.getPrototypeOf(controller);
        if (controllerPrototype) {
            const controllerProperties = HttpControllerConsumer.getControllerPropertyNames(controllerPrototype);
            //query controller methods that support current http request
            const controllerProperty = controllerProperties.find((x) => {
                const instanceMethod = (controller as any)[x];
                if (instanceMethod == null) {
                    return false;
                }
                if (Object.prototype.hasOwnProperty.call(instanceMethod, 'httpAction') === true) {
                    return instanceMethod.httpAction === action && 
                        Object.prototype.hasOwnProperty.call(instanceMethod, httpMethodDecorator);
                }
                return false;
            });
            //if an action was found for the given criteria
            if (controllerProperty) {
                return (controller as any)[controllerProperty];
            }
        }
    }

}