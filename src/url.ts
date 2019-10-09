import { truncate } from './string';

export function queryStringify(params: Lyam.QueryParams): string {
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
