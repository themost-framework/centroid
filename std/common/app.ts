// MOST Web Framework Centroid for Deno Copyright (c) 2020,
// THEMOST LP All rights reserved BSD-3-Clause license
import {ApplicationConfigurationOptions, ApplicationConfiguration} from "./config.ts";

export abstract class Application {
    private readonly _services: Map<string,any> = new Map();
    constructor(options?: ApplicationConfigurationOptions | any) {
        // set configuration service
        this.useService(ApplicationConfiguration);
        // set application configuration options
        if (options != null) {
            this.getService(ApplicationConfiguration).assign(options);
        }
    }

    /**
     * Gets the instance of application configuration
     */
    get configuration(): ApplicationConfiguration {
        return this.getService(ApplicationConfiguration);
    } 

    /**
     * Defines an application service
     * @param ServiceCtor
     */
    useService(ServiceCtor: new(container: Application) => any): this {
        // initialize service and set it as application named service
        this._services.set(ServiceCtor.name, new ServiceCtor(this));
        // and return
        return this;
    }
    /**
     * Returns true if application has a service of the given type
     * @param ServiceCtor
     */
    hasService(ServiceCtor: new(container: Application) => any): boolean {
        // check if application service exists
        return this._services.has(ServiceCtor.name);
    }

    /**
     * Gets an application service by service type
     * @param ServiceCtor 
     */
    getService<T>(ServiceCtor: new(container: Application) => T): T {
        return this._services.get(ServiceCtor.name);
    }

    /**
     * Defines an application strategy by setting a service type and a strategy type
     * @param ServiceCtor 
     * @param StrategyCtor 
     */
    useStrategy(ServiceCtor: new(container: Application) => any, 
        StrategyCtor: new(container: Application) => any): this {
        // initialize strategy and set it as application named service
        this._services.set(ServiceCtor.name, new StrategyCtor(this));
        return this;
    }
}
/**
 * An abstract class that defines an application service
 */
export abstract class ApplicationService {
    public readonly application: Application;
    constructor(container: Application) {
        this.application = container;
    } 
}