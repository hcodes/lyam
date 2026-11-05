/**
 * @jest-environment jsdom
 */

import {
    hit,
    reachGoal,
    notBounce,
    extLink,
    file,
    params,
    userParams,
    configureTransport,
} from '../src/index';

jest.mock('../src/number', () => ({
    getRandom(): number {
        return 123;
    },
}));

jest.mock('../src/time', () => ({
    getSeconds(): number {
        return 1600000000;
    },
}));

const counterId = '123456';
const fetchOptions = { credentials: 'include', keepalive: true };

describe('API', () => {
    beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        global.fetch = jest.fn(() => Promise.resolve());
    });

    describe('hit', () => {
        it('without params', () => {
            hit(counterId);

            expect(global.fetch).toHaveBeenCalledWith(
                'https://mc.yandex.ru/watch/123456?browser-info=pv%3A1%3Aar%3A1%3Arn%3A123%3Ac%3A1%3As%3A0x0x24%3Ask%3A1%3Aw%3A1024x768%3Aen%3Autf-8%3Aet%3A1600000000%3Ast%3A1600000000&rn=123&page-url=http%3A%2F%2Flocalhost%2F',
                fetchOptions
            );
        });

        it('with page params', () => {
            hit(counterId, {
                url: 'https://example.com',
                referrer: 'https://anothersite.com',
                title: 'My Title'
            });

            expect(global.fetch).toHaveBeenCalledWith(
                'https://mc.yandex.ru/watch/123456?browser-info=pv%3A1%3Aar%3A1%3Arn%3A123%3Ac%3A1%3As%3A0x0x24%3Ask%3A1%3Aw%3A1024x768%3Aen%3Autf-8%3Aet%3A1600000000%3Ast%3A1600000000%3At%3AMy%20Title&rn=123&page-url=https%3A%2F%2Fexample.com&page-ref=https%3A%2F%2Fanothersite.com',
                fetchOptions
            );
        });

        it('forwards ut from page params', () => {
            hit(counterId, { ut: 'noindex' });

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('&ut=noindex'),
                fetchOptions
            );
        });

        it('with user params', () => {
            hit(counterId, {
                url: 'https://example.com',
                referrer: 'https://anothersite.com',
                title: 'My Title'
            }, { myParam: 123 });

            expect(global.fetch).toHaveBeenCalledWith(
                'https://mc.yandex.ru/watch/123456?browser-info=pv%3A1%3Aar%3A1%3Arn%3A123%3Ac%3A1%3As%3A0x0x24%3Ask%3A1%3Aw%3A1024x768%3Aen%3Autf-8%3Aet%3A1600000000%3Ast%3A1600000000%3At%3AMy%20Title&rn=123&page-url=https%3A%2F%2Fexample.com&page-ref=https%3A%2F%2Fanothersite.com&site-info=%7B%22myParam%22%3A123%7D',
                fetchOptions
            );
        });
    });

    describe('goal', () => {
        it('without params', () => {
            reachGoal(counterId, 'myGoal');

            expect(global.fetch).toHaveBeenCalledWith(
                'https://mc.yandex.ru/watch/123456?browser-info=ar%3A1%3Arn%3A123%3Ac%3A1%3As%3A0x0x24%3Ask%3A1%3Aw%3A1024x768%3Aen%3Autf-8%3Aet%3A1600000000%3Ast%3A1600000000&rn=123&page-url=goal%3A%2F%2Flocalhost%2FmyGoal&page-ref=http%3A%2F%2Flocalhost%2F',
                fetchOptions
            );
        });

        it('with params', () => {
            reachGoal(counterId, 'myGoal', { myParam: 123 });

            expect(global.fetch).toHaveBeenCalledWith(
                'https://mc.yandex.ru/watch/123456?browser-info=ar%3A1%3Arn%3A123%3Ac%3A1%3As%3A0x0x24%3Ask%3A1%3Aw%3A1024x768%3Aen%3Autf-8%3Aet%3A1600000000%3Ast%3A1600000000&rn=123&page-url=goal%3A%2F%2Flocalhost%2FmyGoal&page-ref=http%3A%2F%2Flocalhost%2F&site-info=%7B%22myParam%22%3A123%7D',
                fetchOptions
            );
        });
    });

    it('extLink', () => {
        extLink(counterId, 'https://google.com');

        expect(global.fetch).toHaveBeenCalledWith(
            'https://mc.yandex.ru/watch/123456?browser-info=ar%3A1%3Aln%3A1%3Arn%3A123%3Ac%3A1%3As%3A0x0x24%3Ask%3A1%3Aw%3A1024x768%3Aen%3Autf-8%3Aet%3A1600000000%3Ast%3A1600000000&rn=123&ut=noindex&page-url=https%3A%2F%2Fgoogle.com&page-ref=http%3A%2F%2Flocalhost%2F',
            fetchOptions
        );
    });

    it('file uses the current page as referrer', () => {
        file(counterId, 'https://example.com/file.zip');

        expect(global.fetch).toHaveBeenCalledWith(
            'https://mc.yandex.ru/watch/123456?browser-info=ar%3A1%3Adl%3A1%3Aln%3A1%3Arn%3A123%3Ac%3A1%3As%3A0x0x24%3Ask%3A1%3Aw%3A1024x768%3Aen%3Autf-8%3Aet%3A1600000000%3Ast%3A1600000000&rn=123&page-url=https%3A%2F%2Fexample.com%2Ffile.zip&page-ref=http%3A%2F%2Flocalhost%2F',
            fetchOptions
        );
    });

    describe('default title', () => {
        let originalTitle: string;

        beforeEach(() => {
            originalTitle = document.title;
            document.title = 'Current page title';
        });

        afterEach(() => {
            document.title = originalTitle;
        });

        it('extLink sends the document title', () => {
            extLink(counterId, 'https://google.com');

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('%3At%3ACurrent%20page%20title'),
                fetchOptions
            );
        });

        it('file sends the document title', () => {
            file(counterId, 'https://example.com/file.zip');

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('%3At%3ACurrent%20page%20title'),
                fetchOptions
            );
        });
    });

    it('notBounce', () => {
        notBounce(counterId);

        expect(global.fetch).toHaveBeenCalledWith(
            'https://mc.yandex.ru/watch/123456?browser-info=ar%3A1%3Anb%3A1%3Arn%3A123%3Ac%3A1%3As%3A0x0x24%3Ask%3A1%3Aw%3A1024x768%3Aen%3Autf-8%3Aet%3A1600000000%3Ast%3A1600000000&rn=123',
            fetchOptions
        );
    });

    it('params', () => {
        params(counterId, { myParam: 123 });

        expect(global.fetch).toHaveBeenCalledWith(
            'https://mc.yandex.ru/watch/123456?browser-info=ar%3A1%3Apa%3A1%3Arn%3A123%3Ac%3A1%3As%3A0x0x24%3Ask%3A1%3Aw%3A1024x768%3Aen%3Autf-8%3Aet%3A1600000000%3Ast%3A1600000000&rn=123&site-info=%7B%22myParam%22%3A123%7D',
            fetchOptions
        );
    });

    it('userParams', () => {
        userParams(counterId, { myParam: 1, UserID: 123 });

        expect(global.fetch).toHaveBeenCalledWith(
            'https://mc.yandex.ru/watch/123456?browser-info=ar%3A1%3Apa%3A1%3Arn%3A123%3Ac%3A1%3As%3A0x0x24%3Ask%3A1%3Aw%3A1024x768%3Aen%3Autf-8%3Aet%3A1600000000%3Ast%3A1600000000&rn=123&site-info=%7B%22__ymu%22%3A%7B%22myParam%22%3A1%2C%22UserID%22%3A123%7D%7D',
            fetchOptions
        );
    });

    describe('unserializable user params', () => {
        let consoleError: jest.SpyInstance;

        beforeEach(() => {
            consoleError = jest.spyOn(console, 'error').mockImplementation(() => {/** quiet in test output */});
        });

        afterEach(() => {
            consoleError.mockRestore();
        });

        it('hit() still sends the page without site-info', () => {
            const circular: Record<string, unknown> = { name: 'loop' };
            circular.self = circular;

            expect(() => hit(counterId, { url: 'https://example.com' }, circular)).not.toThrow();

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('page-url=https%3A%2F%2Fexample.com'),
                fetchOptions
            );
            expect(global.fetch).toHaveBeenCalledWith(
                expect.not.stringContaining('site-info'),
                fetchOptions
            );
            expect(consoleError).toHaveBeenCalledTimes(1);
        });

        it('params() still sends the hit without site-info', () => {
            const circular: Record<string, unknown> = {};
            circular.self = circular;

            expect(() => params(counterId, circular)).not.toThrow();

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('browser-info=ar%3A1%3Apa%3A1'),
                fetchOptions
            );
            expect(global.fetch).toHaveBeenCalledWith(
                expect.not.stringContaining('site-info'),
                fetchOptions
            );
            expect(consoleError).toHaveBeenCalledWith(
                '[lyam] Could not serialize visit params:',
                expect.any(Error)
            );
        });
    });

    describe('configureTransport', () => {
        let consoleError: jest.SpyInstance;

        beforeEach(() => {
            consoleError = jest.spyOn(console, 'error').mockImplementation(() => {/** quiet in test output */});
        });

        afterEach(() => {
            consoleError.mockRestore();
            configureTransport({ metrikaOrigin: 'https://mc.yandex.ru' });
        });

        it('sends hits to the configured origin without trailing slashes', () => {
            configureTransport({ metrikaOrigin: 'https://mc.yandex.com//' });

            hit(counterId);

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('https://mc.yandex.com/watch/123456?'),
                fetchOptions
            );
            expect(global.fetch).toHaveBeenCalledWith(
                expect.not.stringContaining('//watch/'),
                fetchOptions
            );
            expect(consoleError).not.toHaveBeenCalled();
        });

        it('keeps the default origin when the scheme is missing', () => {
            configureTransport({ metrikaOrigin: 'mc.yandex.com' });

            hit(counterId);

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('https://mc.yandex.ru/watch/123456?'),
                fetchOptions
            );
            expect(consoleError).toHaveBeenCalledTimes(1);
        });

        it('keeps the default origin for http', () => {
            configureTransport({ metrikaOrigin: 'http://mc.yandex.com' });

            hit(counterId);

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('https://mc.yandex.ru/watch/123456?'),
                fetchOptions
            );
            expect(consoleError).toHaveBeenCalledTimes(1);
        });

        it('keeps the default origin when the host is missing', () => {
            configureTransport({ metrikaOrigin: 'https://' });

            hit(counterId);

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('https://mc.yandex.ru/watch/123456?'),
                fetchOptions
            );
            expect(consoleError).toHaveBeenCalledTimes(1);
        });
    });
});
