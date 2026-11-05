/**
 * @jest-environment node
 */

import {
    getHost,
    getPageUrl,
    getTitle,
    getScreenSize,
    getDevicePixelRatio,
    cookieEnabled,
} from '../src/dom';

// The library reads the page straight from the globals, so the test installs a
// minimal stand-in for them. The cast steps out of the DOM types on purpose: a
// real Location or Screen has properties that are irrelevant here.
const environment = global as unknown as {
    window?: {
        location: {hostname: string; href: string};
        devicePixelRatio: number;
    };
    document?: {title: string};
    screen?: {width: number; height: number; colorDepth: number};
};

describe('dom', () => {
    afterEach(() => {
        delete environment.window;
        delete environment.document;
        delete environment.screen;
    });

    it('returns empty values while there is no window', () => {
        expect(getPageUrl()).toEqual('');
        expect(getHost()).toEqual('');
        expect(getTitle()).toEqual('');
        expect(getScreenSize()).toEqual('');
        expect(getDevicePixelRatio()).toEqual(1);
        expect(cookieEnabled()).toEqual(false);
    });

    it('reads the environment when it appears after the import', () => {
        // The module is imported before these globals exist, so a feature flag
        // taken once at import time would keep every value empty here.
        environment.window = {
            location: {hostname: 'example.com', href: 'https://example.com/page'},
            devicePixelRatio: 2,
        };
        environment.document = {title: 'Page title'};
        environment.screen = {width: 1024, height: 768, colorDepth: 24};

        expect(getPageUrl()).toEqual('https://example.com/page');
        expect(getHost()).toEqual('example.com');
        expect(getTitle()).toEqual('Page title');
        expect(getScreenSize()).toEqual('1024x768x24');
        expect(getDevicePixelRatio()).toEqual(2);
    });
});
