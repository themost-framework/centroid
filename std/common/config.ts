/**
 * MOST Web Framework Centroid for Deno
 * Copyright (c) 2020, THEMOST LP All rights reserved
 *
 * Use of this source code is governed by an BSD-3-Clause license that can be
 * found in the LICENSE file at https://themost.io/license
 */
/**
 * Defines an application service under application services section
 */
export declare interface ApplicationServiceConfiguration {
    serviceType: any;
    strategyType?: any;
}
/**
 * Represents a set of options to properly configure an application
 */
export declare interface ApplicationConfigurationOptions {
    base?: string;
    services?: Array<ApplicationServiceConfiguration>;
}
/**
 * Defines a service for managing application configuration
 */
export class ApplicationConfiguration {
    public readonly application: any;
    private _options: ApplicationConfigurationOptions;
    constructor(container: any) {
        this.application = container;
        this._options = {
            base: ".",
            services: []
        };
    }
    /**
     * Assigns application configuration
     * @param options 
     */
    assign(options: ApplicationConfigurationOptions): ApplicationConfiguration {
        Object.assign(this._options, options);
        return this;
    }
}