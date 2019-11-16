import { truncate } from '../src/string';

describe('string', () => {
    it('truncate()', () => {
        expect(truncate('1234567890', 5)).toEqual('12345');
    });
});
