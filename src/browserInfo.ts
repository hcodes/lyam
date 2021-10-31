import { getCharset, cookieEnabled, getScreenSize, getClientSize } from './dom';
import { truncate } from './string';
import { getRandom } from './number';
import { getSeconds } from './time';
import type { LyamBrowserInfoValue, LyamBrowserInfo } from './index';

const MAX_TITLE_LEN = 512;

function addParam(result: string[], name: string, value: LyamBrowserInfoValue): void {
    if (value || value === 0) {
        result.push(name + ':' + (value === true ? '1' : value));
    }
}

export function getBrowserInfo(params: LyamBrowserInfo, title: string): string {
    const result: string[] = [];

    if (params) {
        Object.keys(params).forEach((key) => addParam(result, key, params[key]));
    }

    addParam(result, 'rn', getRandom());
    addParam(result, 'c', cookieEnabled());
    addParam(result, 's', getScreenSize());
    addParam(result, 'w', getClientSize());
    addParam(result, 'en', getCharset());

    const time = getSeconds();
    addParam(result, 'et', time);
    addParam(result, 'st', time);

    addParam(result, 't', truncate(title, MAX_TITLE_LEN));

    return result.join(':');
}
