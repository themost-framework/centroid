// MOST Web Framework Centroid for Deno Copyright (c) 2020,
// THEMOST LP All rights reserved BSD-3-Clause license
import { posix } from "https://deno.land/std/path/mod.ts";
import {Application, ApplicationService} from "../common/app.ts";
import { Args } from "../common/mod.ts";

export declare interface HttpRoute {
    path: string;
    pathMatch?: string;
    redirectTo?: string;
    controller?: any;
    action?: string;
    verb?: any;
    children?: Array<HttpRoute>;
    parentParams?: any;
}

export declare interface  HttpActivatedRoute {
    routeConfig: HttpRoute;
    params: any;
}

declare interface HttpRouteParamConfig {
    name: string;
    parser?: (value: any) => any;
    pattern?: RegExp;
    value?: any
}

export class HttpRouter extends ApplicationService {

    public config: Array<HttpRoute> = [];
    /**
     * A set of parsers for parsing route data
     */
    public readonly parsers: Map<string, (value: any) => any> = new Map([
        [ 'int', function(value: any) {
            return parseInt(value);
        } ],
        [ 'boolean', function(value: any) {
            return (/^true$/ig.test(value));
        } ],
        [ 'decimal', function(value: any) {
            return parseFloat(value);
        } ],
        [ 'float', function(value: any) {
            return parseFloat(value);
        } ],
        [ 'string', function(value: any) {
            return value.replace(/^'/,'').replace(/'$/,'');
        } ],
        [ 'date', function(value: any) {
            return new Date(Date.parse(value.replace(/^(datetime)?'/,'').replace(/'$/,'')));
        } ]
    ]);
    /**
     * A set of patterns for parsing route data
     */
    public readonly patterns: Map<string, () => any> = new Map([
        [ 'int', function() {
            return "^[1-9]([0-9]*)$";
        }],
        [ 'boolean', function() {
            return "^true|false$";
        }],
        [ 'decimal', function() {
            return "^[+-]?[0-9]*\\.?[0-9]*$";
        }],
        [ 'float', function() {
            return "^[+-]?[0-9]*\\.?[0-9]*$";
        }],
        [ 'guid', function() {
            return "^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$";
        }],
        [ 'string', function() {
            return "^'(.*)'$"
        }],
        [ 'date', function() {
            return "^(datetime)?'\\d{4}-([0]\\d|1[0-2])-([0-2]\\d|3[01])(?:[T ](\\d+):(\\d+)(?::(\\d+)(?:\\.(\\d+))?)?)?(?:Z(-?\\d*))?([+-](\\d+):(\\d+))?'$";
        }]
    ]);
    constructor(app: Application) {
        super(app);
    }

    /**
     * Initializes route configuration
     * @param items 
     */
    routes(items: Array<HttpRoute>) {
        // clear array of routes
        this.config.splice(0, this.config.length);
        this.config.push.apply(this.config, items);
    }

    isMatch(routeConfig: HttpRoute, urlToMatch: string): HttpActivatedRoute | void {
        if (routeConfig == null) {
            throw new Error("Route configuration may not be null");
        }
        Args.notNull(routeConfig, 'Route configuration');
        Args.notEmpty(urlToMatch, 'Route URL');
        let str1 = urlToMatch;
        let patternMatcher: any;
        let patternMatch: any;
        let parser:any = null;
        let k = urlToMatch.indexOf('?');
        if (k >= 0)
            str1 = urlToMatch.substr(0, k);
        let re = /({([\w[\]]+)(?::\s*((?:[^{}\\]+|\\.|{(?:[^{}\\]+|\\.)*})+))?})|((:)([\w[\]]+))/ig;
        let match = re.exec(routeConfig.path);
        let paramConfig = [];
        while(match) {
            if (match[2] == null) {
                //parameter with colon (e.g. :id)
                paramConfig.push(<HttpRouteParamConfig>{
                    name: match[6],
                    value: null
                });
            }
            else if (match[3] != null) {
                //common expressions
                patternMatch = match[3];
                parser = null;
                patternMatcher = this.patterns.get(patternMatch);
                if (patternMatcher != null) {
                    // reset pattern
                    patternMatch = patternMatcher();
                    // set parser
                    if (this.parsers.has(match[3])) {
                        parser = this.parsers.get(match[3]);
                    }
                }
                paramConfig.push(<HttpRouteParamConfig>{
                    name: match[2],
                    pattern: new RegExp(patternMatch, "ig"),
                    parser: parser,
                    value: null
                });
            }
            else {
                paramConfig.push({
                    name: match[2],
                    value: null
                });
            }
            match = re.exec(routeConfig.path);
        }
        let str, matcher;
        str = routeConfig.path.replace(re, "([\\$_\\-.:',+=%0-9\\w-]+)");
        const pathMatch = routeConfig.pathMatch ? routeConfig.pathMatch : 'prefix';
        // validate pathMatch (prefix or full)
        if (pathMatch === 'full') {
            matcher = new RegExp("^" + str + "$", "ig");
        } else if (pathMatch === 'prefix') {
            matcher = new RegExp("^" + str, "ig");
        } else {
            throw new Error('Route configuration pathMatch argument is invalid. Expected prefix or full.');
        }
        match = matcher.exec(str1);
        if (match == null) {
            return;
        }
        let decodedMatch;
        for (let i = 0; i < paramConfig.length; i++) {
            let param = paramConfig[i];
            if (param.pattern != null) {
                if (!param.pattern.test(match[i+1])) {
                    return;
                }
            }
            decodedMatch = decodeURIComponent(match[i+1]);
            if (typeof param.parser === 'function') {
                param.value = param.parser((match[i+1] !== decodedMatch) ? decodedMatch : match[i+1]);
            }
            else {
                param.value = (match[i+1] !== decodedMatch) ? decodedMatch : match[i+1];
            }

        }
        let params = paramConfig.reduce((result, item) => {
            Object.defineProperty(result, item.name, {
                configurable: true,
                enumerable: true,
                writable: true,
                value: item.value
            });
            return result;
        }, {});
        // try to assign routeConfig parent params if any
        Object.assign(params, routeConfig.parentParams);
        return {
            routeConfig,
            params
        };
    }

    query(routes: HttpRoute[], url: string): HttpActivatedRoute | any {
        for (const route of routes) {
            // an empty route path is actually a "/"
            route.path = route.path || '/';
            let currentRoute =<HttpActivatedRoute>this.isMatch(route, url);
            if (currentRoute) {
                // validate pathMatch parameter
                // (set to full if it's not defined)
                let pathMatch = currentRoute.routeConfig.pathMatch || 'full';
                // if current route has children
                if (currentRoute.routeConfig.children && currentRoute.routeConfig.children.length) {
                    // (set to prefix if it's not defined)
                    pathMatch = currentRoute.routeConfig.pathMatch || 'prefix';
                }
                // if currentRoute is defined and pathMatch is equal to prefix
                if (currentRoute && pathMatch === 'prefix' && currentRoute.routeConfig.children) {
                    // query children
                    // assign parent path
                    const children = currentRoute.routeConfig.children.map( child => {
                        return Object.assign({ }, child, {
                            // reset path to include parent 
                            path: posix.join(currentRoute.routeConfig.path, child.path),
                            // set params
                            parentParams: currentRoute.params || {}
                        });
                    });
                    // query route
                    currentRoute = <HttpActivatedRoute>this.query(children, url);
                    if (currentRoute) {
                        return currentRoute;
                    }
                }
                // if patchMatch is full return current route
                if (currentRoute && pathMatch === 'full') {
                    return currentRoute;
                }
            }
        }
    }


}