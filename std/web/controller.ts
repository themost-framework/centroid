import { HttpNextResult, HttpEndResult } from "./signals.ts";
import { HttpContentResult, HttpJsonResult } from "./results.ts";
import { HttpContext } from "./context.ts";

/**
 * @param {string} name
 * @returns {Function}
 */
export function httpController(name: string):(target:any) => any {
    return function (target:any) {
        if (typeof target === 'function') {
            target.httpController = true;
        }
        // define controller name
        Object.defineProperty(target, 'httpControllerName', {
            value: name,
            configurable: false,
            enumerable: true,
            writable: true
        });
        return target;
    }
}

export class InvalidDecoratorDescriptor extends Error {
    constructor(message?: string) {
        super(message || 'Invalid decorator descriptor. Expected function.');
    }
}

export declare interface HttpAction {
    httpGet?: boolean;
    httpPost?: boolean;
    httpPut?: boolean;
    httpDelete?: boolean;
    httpPatch?: boolean;
    httpOptions?: boolean;
    httpHead?: boolean;
}
/**
 * Defines that the method where applied handles an HTTP GET request
 */
export function httpGet(action?: string):(target:any, key: string, descriptor:PropertyDescriptor) => any {
    return function (target:any, key: string, descriptor:PropertyDescriptor) {
        if (typeof descriptor.value !== 'function') {
            throw new Error('Invalid decorator descriptor. Expected function.');
        }
        Object.assign(descriptor.value, {
            httpGet: true
        });
        if (action) {
            httpAction(action)(target, key, descriptor);
        }
        return descriptor;
    }
}
/**
 * Defines that the method where applied handles any HTTP method e.g. GET, POST, PUT etc
 */
export function httpAny(action?: string):(target:any, key: string, descriptor:PropertyDescriptor) => any {
    return function (target:any, key: string, descriptor:PropertyDescriptor) {
        if (typeof descriptor.value !== 'function') {
            throw new InvalidDecoratorDescriptor();
        }
        Object.assign(descriptor.value, {
            httpGet: true,
            httpPost: true,
            httpPut: true,
            httpDelete: true,
            httpPatch: true,
            httpOptions: true,
            httpHead: true
        });  
        if (action) {
            httpAction(action)(target, key, descriptor);
        }
        return descriptor;
    }
}
/**
 * Defines that the method where applied handles an HTTP POST request
 */
export function httpPost(action?: string):(target:any, key: string, descriptor:PropertyDescriptor) => any {
    return function (target:any, key: string, descriptor:PropertyDescriptor) {
        if (typeof descriptor.value === 'function') {
            descriptor.value.httpPost = true;
        }
        if (action) {
            httpAction(action)(target, key, descriptor);
        }
        return descriptor;
    }
}
/**
 * Defines that the method where applied handles an HTTP PATCH request
 */
export function httpPatch(action?: string):(target:any, key: string, descriptor:any) => any {
    return function (target:any, key: string, descriptor:any) {
        if (typeof descriptor.value !== 'function') {
            throw new InvalidDecoratorDescriptor();
        }
        Object.assign(descriptor.value, {
            httpPatch: true
        });
        if (action) {
            httpAction(action)(target, key, descriptor);
        }  
        return descriptor;
    }
}
/**
 * Defines that the method where applied handles an HTTP PUT request
 */
export function httpPut(action?: string):(target:any, key: string, descriptor:PropertyDescriptor) => any {
    return function (target:any, key: string, descriptor:any) {
        if (typeof descriptor.value !== 'function') {
            throw new InvalidDecoratorDescriptor();
        }
        Object.assign(descriptor.value, {
            httpPut: true
        });
        if (action) {
            httpAction(action)(target, key, descriptor);
        }
        return descriptor;
    }
}
/**
 * Defines that the method where applied handles an HTTP DELETE request
 */
export function httpDelete(action?: string):(target:any, key: string, descriptor:PropertyDescriptor) => any {
    return function (target:any, key: string, descriptor:PropertyDescriptor) {
        if (typeof descriptor.value !== 'function') {
            throw new InvalidDecoratorDescriptor();
        }
        Object.assign(descriptor.value, {
            httpDelete: true
        });
        if (action) {
            httpAction(action)(target, key, descriptor);
        }
        return descriptor;
    }
}
/**
 * Defines that the method where applied handles an HTTP OPTIONS request
 */
export function httpOptions():(target:any, key: string, descriptor:PropertyDescriptor) => any {
    return function (target:any, key: string, descriptor:PropertyDescriptor) {
        if (typeof descriptor.value !== 'function') {
            throw new InvalidDecoratorDescriptor();
        }
        Object.assign(descriptor.value, {
            httpOptions: true
        });        
        return descriptor;
    }
}
/**
 * Defines that the method where applied handles an HTTP HEAD request
 */
export function httpHead(action?: string):(target:any, key: string, descriptor:PropertyDescriptor) => any {
    return function (target:any, key: string, descriptor:PropertyDescriptor) {
        if (typeof descriptor.value !== 'function') {
            throw new InvalidDecoratorDescriptor();
        }
        Object.assign(descriptor.value, {
            httpHead: true
        });
        if (action) {
            httpAction(action)(target, key, descriptor);
        }
        return descriptor;
    }
}
/**
 * Defines that the method where applied represents an action of an http controller
 */
export function httpAction(name: string):(target:any, key: string, descriptor:PropertyDescriptor) => any {
    return function (target:any, key: string, descriptor:PropertyDescriptor) {
        if (typeof descriptor.value !== 'function') {
            throw new InvalidDecoratorDescriptor();
        }
        Object.assign(descriptor.value, {
            httpAction: name
        });
        return descriptor;
    }
}

export class HttpController  {

    public context?: HttpContext;

    /**
     * Indicates that request processsing continue at next level
     */
    next(): HttpNextResult {
        return new HttpNextResult();
    }

    /**
     * Returns an html content
     * @param data 
     */
    content(data: string): HttpNextResult {
        return new HttpContentResult(data);
    }

    /**
     * Returns a JSON document
     * @param data
     */
    json(data: any): HttpNextResult {
        return new HttpJsonResult(data);
    }
    /**
     * Indicates that request should be ended
     */
    end(): HttpEndResult {
        return new HttpEndResult();
    }

}