// MOST Web Framework Centroid for Deno Copyright (c) 2020, THEMOST LP All rights reserved BSD-3-Clause license
import {Application} from "./app.ts";
/**
 * Defines a user context
 */
export abstract class Context {
    private _application: Application | any;
    constructor() {
        //
    }
    get application(): Application {
        return this._application;
    }
    set application(value: Application) {
        this._application = value;
    }
}