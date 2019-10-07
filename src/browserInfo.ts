import { getCharset} from './dom';
import { truncate } from './string';

const MAX_TITLE_LEN = 512;

function getParam(name: string, value: Lyam.BrowserInfoValue): string {
    return name + ':' + (value === true ? '1' : value);
}

function addParam(result: string[], name: string, value: Lyam.BrowserInfoValue): void {
    if (value !== '' && value !== false && value !== undefined && value !== null) {
        result.push(getParam(name, value));
    }
}

export function getBrowserInfo(params: Lyam.BrowserInfo, title: string): string {
    const result: string[] = [];

    Object.keys(params).forEach((key) => addParam(result, key, params[key]));

    addParam(result, 'en', getCharset());
    addParam(result, 'rn', Math.floor(Math.random() * 1E6));
    addParam(result, 't', truncate(title, MAX_TITLE_LEN));

    return result.join(':');
}
