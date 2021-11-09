import { queryStringify } from './url';
import type { LyamQueryParams } from './index';

export function sendData(counterId: string, queryParams: LyamQueryParams): void {
    const url = 'https://mc.yandex.ru/watch/' + counterId + '?' + queryStringify(queryParams);
    const hasBeacon = typeof navigator !== 'undefined' && navigator.sendBeacon;

    if (!hasBeacon || !navigator.sendBeacon(url, ' ')) {
        if (typeof fetch !== 'undefined') {
            fetch(url, { credentials: 'include' }).catch(function() {/** unhandled rejection off */});

        } else if (typeof Image !== 'undefined') {
            new Image().src = url;
        }
    }
}
