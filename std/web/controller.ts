/**
 * @param {string} name
 * @returns {Function}
 */
export function httpController(name: string):(target:any, key: string, descriptor:any) => any {
    return function (target:any, key: string, descriptor:any) {
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
        return descriptor;
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

export function httpGet():(target:any, key: string, descriptor:any) => any {
    return function (target:any, key: string, descriptor:any) {
        if (typeof descriptor.value !== 'function') {
            throw new Error('Invalid decorator descriptor. Expected function.');
        }
        Object.assign(descriptor.value, {
            httpGet: true
        });        
        return descriptor;
    }
}
/**
 * @returns {Function}
 */
export function httpAny():(target:any, key: string, descriptor:any) => any {
    return function (target:any, key: string, descriptor:any) {
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
        return descriptor;
    }
}
/**
 * @returns {Function}
 */
export function httpPost():(target:any, key: string, descriptor:any) => any {
    return function (target:any, key: string, descriptor:any) {
        if (typeof descriptor.value === 'function') {
            descriptor.value.httpPost = true;
        }
        return descriptor;
    }
}
/**
 * @returns {Function}
 */
export function httpPatch():(target:any, key: string, descriptor:any) => any {
    return function (target:any, key: string, descriptor:any) {
        if (typeof descriptor.value !== 'function') {
            throw new InvalidDecoratorDescriptor();
        }
        Object.assign(descriptor.value, {
            httpPatch: true
        });        
        return descriptor;
    }
}
/**
 * @returns {Function}
 */
export function httpPut():(target:any, key: string, descriptor:any) => any {
    return function (target:any, key: string, descriptor:any) {
        if (typeof descriptor.value !== 'function') {
            throw new InvalidDecoratorDescriptor();
        }
        Object.assign(descriptor.value, {
            httpPut: true
        });        
        return descriptor;
    }
}
/**
 * @returns {Function}
 */
export function httpDelete():(target:any, key: string, descriptor:any) => any {
    return function (target:any, key: string, descriptor:any) {
        if (typeof descriptor.value !== 'function') {
            throw new InvalidDecoratorDescriptor();
        }
        Object.assign(descriptor.value, {
            httpDelete: true
        });        
        return descriptor;
    }
}
/**
 * @returns {Function}
 */
export function httpOptions():(target:any, key: string, descriptor:any) => any {
    return function (target:any, key: string, descriptor:any) {
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
 * @returns {Function}
 */
function httpHead():(target:any, key: string, descriptor:any) => any {
    return function (target:any, key: string, descriptor:any) {
        if (typeof descriptor.value !== 'function') {
            throw new InvalidDecoratorDescriptor();
        }
        Object.assign(descriptor.value, {
            httpHead: true
        });        
        return descriptor;
    }
}
/**
 * @returns {Function}
 */
function httpAction(name: string):(target:any, key: string, descriptor:any) => any {
    return function (target:any, key: string, descriptor:any) {
        if (typeof descriptor.value !== 'function') {
            throw new InvalidDecoratorDescriptor();
        }
        Object.assign(descriptor.value, {
            httpAction: name
        });        
        return descriptor;
    }
}

export class HttpController {

}