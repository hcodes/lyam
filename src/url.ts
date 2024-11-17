import { truncate } from './string';
import type { LyamQueryParams } from './index';

export function queryStringify(params: LyamQueryParams): string {
    return Object.keys(params)
        .filter(key => params[key] || params[key] === 0)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
        .join('&');
}

const MAX_URL_LEN = 1024;

export function prepareUrl(url: string): string {
    return truncate(url, MAX_URL_LEN);
}

export function normalizeOrigin(origin: string): string {
    if (origin.endsWith('/')) {
        return origin.slice(0, origin.length - 1)
    }

    return origin;
}
