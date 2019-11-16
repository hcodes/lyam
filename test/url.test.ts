import { prepareUrl, queryStringify } from '../src/url';

describe('url', () => {
    it('prepareUrl()', () => {
        expect(prepareUrl('1'.repeat(10000)).length).toEqual(1024);
    });

    it('#queryStringify()', () => {
        expect(queryStringify({
            a: '123',
            b: 123,
            c: 0,
            d: undefined,
            e: null,
            f: '',
            g: true,
            h: false,
            i: '1 2 3'
        })).toEqual('a=123&b=123&c=0&g=true&i=1%202%203');
    });
});
