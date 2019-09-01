import { getBrowserInfo, IBrowserInfo } from './browserInfo';
import { getTitle, getPageUrl, getReferrer, getHost } from './dom';
import { sendData } from './transport';
import { truncate } from './string';

const MAX_URL_LEN = 1024;

interface IHitParams {
    referrer?: string;
    title?: string;
    url?: string;
}

interface IHitExtParams {
    counterId: string;
    browserInfo?: IBrowserInfo;
    pageParams: IHitParams;
    requestParams?: IRequestParams;
    userVars?: IUserVars;
}

interface IUserVars {
    [key: string]: any;
}

interface IRequestParams {
    [key: string]: string;
}

/**
 * Отправка хита.
 *
 * @param {string} counterId - Номер счётчика.
 * @param {Object} hitParams -  Параметры страницы.
 * @param {string} [hitParams.url] - Адрес страницы.
 * @param {string} [hitParams.title] - Заголовок страницы.
 * @param {string} [hitParams.referrer] - Реферер страницы.
 * @param {Object} [userParams] - Параметры визитов.
 *
 * @example
 * hit('123456');
 * 
 * hit('123456', {
 *     referer: document.referer,
 *     title: document.title,
 *     url: window.location.href
 * }, {
 *     myParam: 'value'
 * });
 */
export function hit(counterId: string, hitParams?: IHitParams, userVars?: IUserVars) {
    const referrer = hitParams && hitParams.referrer !== undefined ?
        hitParams.referrer :
        getReferrer();

    const title = hitParams && hitParams.title !== undefined ?
        hitParams.title :
        getTitle();

    const url = hitParams && hitParams.url !== undefined ?
        hitParams.url :
        getPageUrl();

    hitExt({
        counterId,
        pageParams: {
            referrer,
            title,
            url
        },
        userVars
    });
}

/**
 * Достижение цели.
 *
 * @param {string} counterId - Номер счётчика.
 * @param {string} name - Название цели.
 * @param {Object} [userParams] - Параметры визитов.
 *
 * @example
 * reachGoal('123456', 'goalName');
*/
export function reachGoal(counterId: string, name?: string, userVars?: IUserVars) {
    let referrer;
    let url;
    
    if (name) {
        referrer = getPageUrl();
        url = `goal://${getHost()}/${name}`;
    } else {
        referrer = getReferrer();
        url = getPageUrl();
    }

    hitExt({
        counterId,
        pageParams: { referrer, url },
        userVars
    });
}

/**
 * Внешняя ссылка.
 *
 * @param {string} counterId - Номер счётчика.
 * @param {string} link - Адрес ссылки.
 * @param {string} [title] - Заголовок страницы.
 *
 * @example
 * extLink('https://example.com');
 */
export function extLink(counterId: string, link: string, title?: string) {
    if (link) {
        hitExt({
            browserInfo: { ln: true },
            counterId,
            pageParams:  {
                referrer: getPageUrl(),
                title,
                url: link
            },
            requestParams: { ut: 'noindex' }
        });
    }
}

/**
 * Загрузка файла.
 *
 * @param {string} counterId - Номер счётчика.
 * @param {string} file - Ссылка на файл.
 * @param {string} [title] - Заголовок страницы.
 *
 * @example
 * file('123456', 'https://mysite.com/file.zip');
 */
export function file(counterId: string, file: string, title?: string) {
    if (file) {
        hitExt({
            browserInfo: {
                dl: true,
                ln: true
            },
            counterId,
            pageParams: {
                referrer: getReferrer(),
                title,
                url: file
            }
        });
    }
}

/**
 * Параметры визитов.
 *
 * @param {string} counterId - Номер счётчика.
 * @param {...*} data - Параметры визитов.
 *
 * @example
 * userVars(counterId, { myParam: 'value' });
 */
export function userVars(counterId: string, data: IUserVars) {
    if (data) {
        hitExt({
            browserInfo: { pa: true },
            counterId,
            pageParams: {},
            userVars: data
        });
    }
}

/**
 * Не отказ.
 *
 * @example
 * notBounce('123456');
 */
export function notBounce(counterId: string) {
    hitExt({
        browserInfo: { nb: true },
        counterId,
        pageParams: {}
    });
}

export function hitExt(params: IHitExtParams) {
    const {
        browserInfo,
        counterId,
        pageParams,
        requestParams,
        userVars
    } = params;

    const data = {};

    if (pageParams.url) {
        data['page-url'] = truncate(pageParams.url, MAX_URL_LEN);
    }

    if (pageParams.referrer) {
        data['page-ref'] = truncate(pageParams.referrer, MAX_URL_LEN);
    }

    data['browser-info'] = getBrowserInfo(browserInfo, pageParams.title);

    if (userVars) {
        data['site-info'] = JSON.stringify(userVars);
    }

    Object.keys(requestParams).forEach((key) => {
        data[key] = requestParams[key];
    });

    sendData(counterId, data);
}
