// MOST Web Framework Centroid for Deno Copyright (c) 2020, THEMOST LP All rights reserved BSD-3-Clause license
import {Application, ApplicationService} from "../common/app.ts";
import { Args } from "../common/mod.ts";

export declare interface HttpRouteConfig {
    controller?: any;
    action?: string;
    verb?: any;
    url: string;
}

export declare interface  HttpActivatedRoute {
    routeConfig: HttpRouteConfig;
    params: any;
}

declare interface HttpRouteParamConfig {
    name: string;
    parser?: (value: any) => any;
    pattern?: RegExp;
    value?: any
}

export class HttpRouter extends ApplicationService {
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

    isMatch(routeConfig: HttpRouteConfig, urlToMatch: string): HttpActivatedRoute | void {
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
        let match = re.exec(routeConfig.url);
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
            match = re.exec(routeConfig.url);
        }
        let str, matcher;
        str = routeConfig.url.replace(re, "([\\$_\\-.:',+=%0-9\\w-]+)");
        matcher = new RegExp("^" + str + "$", "ig");
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
                value: item.value
            });
            return result;
        }, {});
        return {
            routeConfig,
            params
        };
    }


}