import { getCharset} from './dom';
import { truncate } from './string';

const MAX_TITLE_LEN = 512; 

export interface IBrowserInfo {
    [key: string]: any;
}

function getParam(name: string, value: any): string {
    return name + ':' + (value === true ? '1' : value);
}

function addParam(result: string[], name: string, value: any) {
    if (value !== '' && value !== false && value !== undefined && value !== null) {
        result.push(getParam(name, value));
    }
}

export function getBrowserInfo(params: IBrowserInfo, title: string): string {
    const result = [];

    Object.keys(params).forEach((key) => addParam(result, key, params[key]));

    addParam(result, 'en', getCharset());
    addParam(result, 'rn', Math.floor(Math.random() * 1E6));
    addParam(result, 't', truncate(title, MAX_TITLE_LEN));

    return result.join(':');
}
