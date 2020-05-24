import {
    assert,
    assertEquals,
    assertThrows
 } from "https://deno.land/std/testing/asserts.ts";
import { ApplicationConfiguration } from "./config.ts";
 
 const { test } = Deno;

 test("new ApplicationConfiguration()", async function (): Promise<void> {
    const container = {};
    const configuration = new ApplicationConfiguration(container);
    assert(configuration instanceof ApplicationConfiguration);
});

test("ApplicationConfiguration.assign()", async function (): Promise<void> {
    const container = {};
    const configuration = new ApplicationConfiguration(container);
    configuration.assign({
        base: './src',
        services: [],
        settings: {
            auth: {
                server_uri: "https://example.com/auth/"
            }
        }
    });
    let authConfiguration = configuration.getSourceAt('settings/auth');
    assert(authConfiguration);
    assertEquals(authConfiguration.server_uri,  "https://example.com/auth/");
    assertEquals(configuration.getSourceAt('settings/auth1/option1'),  undefined);
    assertEquals(configuration.getSourceAt('settings/auth/option1'),  undefined);
});

test("ApplicationConfiguration.getSourceAt()", async function (): Promise<void> {
    const container = {};
    const configuration = new ApplicationConfiguration(container);
    configuration.assign({
        base: './src',
        services: [],
        settings: {
            auth: {
                server_uri: "https://example.com/auth/"
            }
        }
    });
    let authConfiguration = configuration.getSourceAt('settings/auth');
    assert(authConfiguration);
    assertEquals(authConfiguration.server_uri,  "https://example.com/auth/");
    assertEquals(configuration.getSourceAt('settings/auth1/option1'),  undefined);
    assertEquals(configuration.getSourceAt('settings/auth/option1'),  undefined);
});

test("ApplicationConfiguration.setSourceAt()", async function (): Promise<void> {
    const container = {};
    const configuration = new ApplicationConfiguration(container);
    configuration.assign({
        base: './src',
        services: []
    });
    let authConfiguration = configuration.getSourceAt("settings/auth");
    assertEquals(authConfiguration,  undefined);
    configuration.setSourceAt("settings/auth", {
        server_uri: "https://example.com/auth/"
    });
});