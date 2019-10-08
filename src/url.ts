import { truncate } from './string';

interface Params {
    [key: string]: string | number | boolean | undefined | null;
}

export function queryStringify(params: Params): string {
    return Object.keys(params)
        .filter(function(key) {
            const val = params[key];
            return val !== '' && val !== undefined && val !== null;
        })
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
        .join('&');
}

const MAX_URL_LEN = 1024;

export function prepareUrl(url: string): string {
    return truncate(url, MAX_URL_LEN);
}
