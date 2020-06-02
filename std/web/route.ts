// MOST Web Framework Centroid for Deno Copyright (c) 2020, THEMOST LP All rights reserved BSD-3-Clause license
import {Application, ApplicationService} from "../common/app.ts";

export class HttpActivatedRoute {
    public readonly route: any;
    public readonly routeData: any;
    constructor(route: any) {
        if (typeof route === 'string') {
            this.route = {
                url:route
            };
        } else if (typeof route === 'object') {
            this.route = route;
        }
        this.routeData = { };
    }

    isMatch(urlToMatch: string) {
        if (typeof this.route == null) {
            throw new Error("Route may not be null");
        }
        if (typeof urlToMatch !== 'string')
            return false;
        if (urlToMatch.length === 0)
            return false;
        let str1 = urlToMatch, patternMatch, parser;
        let k = urlToMatch.indexOf('?');
        if (k >= 0)
            str1 = urlToMatch.substr(0, k);
        let re = /({([\w[\]]+)(?::\s*((?:[^{}\\]+|\\.|{(?:[^{}\\]+|\\.)*})+))?})|((:)([\w[\]]+))/ig;
        let match = re.exec(this.route.url);
        let params = [];
        while(match) {
            if (typeof match[2] === 'undefined') {
                //parameter with colon (e.g. :id)
                params.push({
                    name: match[6],
                    value: null
                });
            }
            else if (typeof match[3] !== 'undefined') {
                //common expressions
                patternMatch = match[3];
                parser = null;
                if (typeof self.patterns[match[3]] === 'function') {
                    patternMatch = self.patterns[match[3]]();
                    if (typeof self.parsers[match[3]] === 'function') {
                        parser = self.parsers[match[3]];
                    }
                }
                params.push({
                    name: match[2],
                    pattern: new RegExp(patternMatch, "ig"),
                    parser: parser,
                    value: null
                });
            }
            else {
                params.push({
                    name: match[2],
                    value: null
                });
            }
            match = re.exec(this.route.url);
        }
        let str, matcher;
        str = this.route.url.replace(re, "([\\$_\\-.:',+=%0-9\\w-]+)");
        matcher = new RegExp("^" + str + "$", "ig");
        match = matcher.exec(str1);
        if (typeof match === 'undefined' || match === null) {
            return false;
        }
        let decodedMatch;
        for (var i = 0; i < params.length; i++) {
            let param = params[i];
            if (typeof param.pattern !== 'undefined') {
                if (!param.pattern.test(match[i+1])) {
                    return false;
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
        params.forEach((x) => {
            this.routeData[x.name] = x.value;
        });
        if (this.route.hasOwnProperty("controller")) {
            this.routeData["controller"] = this.route["controller"];
        }
        if (this.route.hasOwnProperty("action")) {
            this.routeData["action"] = this.route["action"];
        }
        return true;
    }
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
            return "^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$";
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


}