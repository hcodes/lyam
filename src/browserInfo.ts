import { getCharset, cookieEnabled, getScreenSize } from './dom';
import { truncate } from './string';

const MAX_TITLE_LEN = 512;

function addParam(result: string[], name: string, value: Lyam.BrowserInfoValue): void {
    if (value || value === 0) {
        result.push(name + ':' + (value === true ? '1' : value));
    }
}

export function getBrowserInfo(params: Lyam.BrowserInfo, title: string): string {
    const result: string[] = [];

    if (params) {
        Object.keys(params).forEach((key) => addParam(result, key, params[key]));
    }

    addParam(result, 'c', cookieEnabled());
    addParam(result, 's', getScreenSize());
    addParam(result, 'en', getCharset());
    addParam(result, 'rn', Math.floor(Math.random() * 1E6));
    addParam(result, 't', truncate(title, MAX_TITLE_LEN));

    return result.join(':');
}
