import { queryStringify } from './url';

interface IQueryParams {
    [key: string]: string;
}

const METRIKA_URL = 'mc.yandex.ru/watch/';

export function sendData(counterId: string, queryParams: IQueryParams) {
    const url = METRIKA_URL
        + counterId
        + '?rn=' + (Math.floor(Math.random() * 1E6))
        + '&' + queryStringify(queryParams);

    if (typeof navigator && navigator.sendBeacon) {
        navigator.sendBeacon(url, ' ');
    } else if (typeof fetch !== 'undefined') {
        fetch(url);
    } else if (typeof Image !== 'undefined') {
        new Image().src = url;
    }
}
