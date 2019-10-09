import { queryStringify } from './url';

export function sendData(counterId: string, queryParams: Lyam.QueryParams): void {
    const url = 'https://mc.yandex.ru/watch/' + counterId + '?' + queryStringify(queryParams);

    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        navigator.sendBeacon(url, ' ');
    } else if (typeof fetch !== 'undefined') {
        fetch(url, { credentials: 'include' });
    } else if (typeof Image !== 'undefined') {
        new Image().src = url;
    }
}
