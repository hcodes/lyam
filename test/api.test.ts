/**
 * @jest-environment jsdom
 */

import { hit, reachGoal, notBounce, extLink, file, userVars } from '../src/index';

jest.mock('../src/number', () => ({
    getRandom(): number {
        return 123;
    },
}));


let spy = jest.fn();

const counterId = '123456';
const fetchOptions = { credentials: 'include' };

describe('API', () => {
    beforeEach(() => {
        spy = jest.fn();
        window.fetch = spy;
    });

    describe('hit', () => {
        it('without params', () => {
            hit(counterId);

            expect(spy).toBeCalledWith(
                'https://mc.yandex.ru/watch/123456?browser-info=rn%3A123%3Ac%3A1%3As%3A0x0x24%3Aen%3Autf-8&rn=123&page-url=http%3A%2F%2Flocalhost%2F',
                fetchOptions
            );
        });

        it('with page params', () => {
            hit(counterId, {
                url: 'https://example.com',
                referrer: 'https://anothersite.com',
                title: 'My Title'
            });

            expect(spy).toBeCalledWith(
                'https://mc.yandex.ru/watch/123456?browser-info=rn%3A123%3Ac%3A1%3As%3A0x0x24%3Aen%3Autf-8%3At%3AMy%20Title&rn=123&page-url=https%3A%2F%2Fexample.com&page-ref=https%3A%2F%2Fanothersite.com',
                fetchOptions
            );
        });

        it('with user params', () => {
            hit(counterId, {
                url: 'https://example.com',
                referrer: 'https://anothersite.com',
                title: 'My Title'
            }, { myParam: 123 });

            expect(spy).toBeCalledWith(
                'https://mc.yandex.ru/watch/123456?browser-info=rn%3A123%3Ac%3A1%3As%3A0x0x24%3Aen%3Autf-8%3At%3AMy%20Title&rn=123&page-url=https%3A%2F%2Fexample.com&page-ref=https%3A%2F%2Fanothersite.com&site-info=%7B%22myParam%22%3A123%7D',
                fetchOptions
            );
        });
    });

    describe('goal', () => {
        it('without userVars', () => {
            reachGoal(counterId, 'myGoal');

            expect(spy).toBeCalledWith(
                'https://mc.yandex.ru/watch/123456?browser-info=rn%3A123%3Ac%3A1%3As%3A0x0x24%3Aen%3Autf-8&rn=123&page-url=goal%3A%2F%2Flocalhost%2FmyGoal&page-ref=http%3A%2F%2Flocalhost%2F',
                fetchOptions
            );
        });

        it('with userVars', () => {
            reachGoal(counterId, 'myGoal', { myParam: 123 });

            expect(spy).toBeCalledWith(
                'https://mc.yandex.ru/watch/123456?browser-info=rn%3A123%3Ac%3A1%3As%3A0x0x24%3Aen%3Autf-8&rn=123&page-url=goal%3A%2F%2Flocalhost%2FmyGoal&page-ref=http%3A%2F%2Flocalhost%2F&site-info=%7B%22myParam%22%3A123%7D',
                fetchOptions
            );
        });
    });

    it('extLink', () => {
        extLink(counterId, 'https://google.com');

        expect(spy).toBeCalledWith(
            'https://mc.yandex.ru/watch/123456?browser-info=ln%3A1%3Arn%3A123%3Ac%3A1%3As%3A0x0x24%3Aen%3Autf-8&rn=123&ut=noindex&page-url=https%3A%2F%2Fgoogle.com&page-ref=http%3A%2F%2Flocalhost%2F',
            fetchOptions
        );
    });

    it('file', () => {
        file(counterId, 'https://example.com/file.zip');

        expect(spy).toBeCalledWith(
            'https://mc.yandex.ru/watch/123456?browser-info=dl%3A1%3Aln%3A1%3Arn%3A123%3Ac%3A1%3As%3A0x0x24%3Aen%3Autf-8&rn=123&page-url=https%3A%2F%2Fexample.com%2Ffile.zip',
            fetchOptions
        );
    });

    it('notBounce', () => {
        notBounce(counterId);

        expect(spy).toBeCalledWith(
            'https://mc.yandex.ru/watch/123456?browser-info=nb%3A1%3Arn%3A123%3Ac%3A1%3As%3A0x0x24%3Aen%3Autf-8&rn=123',
            fetchOptions
        );
    });

    it('userVars', () => {
        userVars(counterId, { myParam: 123 });

        expect(spy).toBeCalledWith(
            'https://mc.yandex.ru/watch/123456?browser-info=pa%3A1%3Arn%3A123%3Ac%3A1%3As%3A0x0x24%3Aen%3Autf-8&rn=123&site-info=%7B%22myParam%22%3A123%7D',
            fetchOptions
        );
    });
});
