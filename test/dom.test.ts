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

describe('dom', () => {
    afterEach(() => {
        // @ts-ignore clean up the installed environment
        delete global.window;
        // @ts-ignore
        delete global.document;
        // @ts-ignore
        delete global.screen;
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
        // @ts-ignore fake browser environment
        global.window = {
            location: {hostname: 'example.com', href: 'https://example.com/page'},
            devicePixelRatio: 2,
        };
        // @ts-ignore
        global.document = {title: 'Page title'};
        // @ts-ignore
        global.screen = {width: 1024, height: 768, colorDepth: 24};

        expect(getPageUrl()).toEqual('https://example.com/page');
        expect(getHost()).toEqual('example.com');
        expect(getTitle()).toEqual('Page title');
        expect(getScreenSize()).toEqual('1024x768x24');
        expect(getDevicePixelRatio()).toEqual(2);
    });
});
