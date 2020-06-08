// MOST Web Framework Centroid for Deno Copyright (c) 2020,
// THEMOST LP All rights reserved BSD-3-Clause license
import { Args } from './args.ts';
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
    assign(options: ApplicationConfigurationOptions | any): ApplicationConfiguration {
        Object.assign(this._options, options);
        return this;
    }
    /**
     * Returns an application configuration option based on the given path
     * e.g. 'settings/authentication/type'
     * @param at 
     */
    getSourceAt(at: string): any {
        Args.notNull(at, 'Configuration option');
        const segments = at.split('/');
        let current = this._options;
        for (const segment of segments) {
            if (Object.prototype.hasOwnProperty.call(current, segment)) {
                current = (<any>current)[segment];
                if (current == null) {
                    return current;
                }
            } else {
                return;
            }
        }
        return current;
    }

    /**
     * Sets an application configuration option based on the given path
     * e.g. 'settings/authentication/type'
     * @param at 
     */
    setSourceAt(at: string, value: any): this {
        Args.notNull(at, 'Configuration option');
        const segments = at.split('/');
        let current = <any>this._options;
        let index = 1;
        for (const segment of segments) {
            // check if property exists
            if (Object.prototype.hasOwnProperty.call(current, segment) == false) {
                // if this is the last segment
                if (index === segments.length) {
                    // set value
                    current[segment] = value;
                    // and return
                    return this;
                }
                // otherwise set empty object and continue
                (<any>current)[segment] = {};
            }
            if (index === segments.length) {
                current[segment] = value;
                return this;
            }
            current = current[segment];
            index += 1;
        }
        return this;
    }
}