import { getBrowserInfo } from './browserInfo';
import { getTitle, getPageUrl, getReferrer, getHost } from './dom';
import { getRandom } from './number';
import { sendData } from './transport';
import { prepareUrl } from './url';

export { configureTransport } from './transport';

export interface LyamHitParams {
    referrer?: string;
    title?: string;
    url?: string;
    ut?: string;
}

export type LyamQueryParams = Record<string, string | boolean | number | undefined | null>;

export type LyamParams = Record<string, unknown>;

export type LyamBrowserInfoValue = boolean | string | number;

export type LyamBrowserInfo = Record<string, LyamBrowserInfoValue>;

export interface LyamHitExtParams {
    counterId: string;
    browserInfo?: LyamBrowserInfo;
    pageParams: LyamHitParams;
    params?: LyamParams;
}

/**
 * Параметры визита приходят от пользовательского кода, поэтому сериализация
 * может упасть на циклической ссылке или в `toJSON()`. Бросать исключение в
 * обработчик страницы нельзя: ошибку выводим в `console.error`, а `site-info`
 * просто не отправляем (`queryStringify` отбрасывает пустые значения).
 */
function stringifyParams(params: LyamParams): string {
    try {
        return JSON.stringify(params);
    } catch (error) {
        console.error('[lyam] Could not serialize visit params:', error);

        return '';
    }
}

export function hitExt(hitExtParams: LyamHitExtParams): void {
    const {
        browserInfo,
        counterId,
        pageParams,
        params,
    } = hitExtParams;

    const data: LyamQueryParams = {
        'browser-info': getBrowserInfo(browserInfo, pageParams.title),
        rn: getRandom(),
        ut: pageParams.ut
    };

    if (pageParams.url) {
        data['page-url'] = prepareUrl(pageParams.url);
    }

    if (pageParams.referrer) {
        data['page-ref'] = prepareUrl(pageParams.referrer);
    }

    if (params) {
        data['site-info'] = stringifyParams(params);
    }

    sendData(counterId, data);
}

/**
 * Отправка хита.
 *
 * @param counterId - Номер счётчика.
 * @param hitParams - Параметры страницы.
 * @param params - Параметры визитов.
 *
 * @example
 * hit('123456');
 *
 * hit('123456', {
 *     referrer: document.referrer,
 *     title: document.title,
 *     url: window.location.href
 * }, {
 *     myParam: 'value'
 * });
 */
export function hit(counterId: string, hitParams?: LyamHitParams, params?: LyamParams): void {
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
        browserInfo: { pv: true, ar: true },
        counterId,
        pageParams: {
            referrer,
            title,
            url,
            ut: hitParams && hitParams.ut
        },
        params
    });
}

/**
 * Достижение цели.
 *
 * @param counterId - Номер счётчика.
 * @param name - Название цели.
 * @param params - Параметры визитов.
 *
 * @example
 * reachGoal('123456', 'goalName');
*/
export function reachGoal(counterId: string, name?: string, params?: LyamParams): void {
    let referrer: string;
    let url: string;

    if (name) {
        referrer = getPageUrl();
        url = `goal://${getHost()}/${name}`;
    } else {
        referrer = getReferrer();
        url = getPageUrl();
    }

    hitExt({
        browserInfo: { ar: true },
        counterId,
        pageParams: { referrer, url },
        params,
    });
}

/**
 * Внешняя ссылка.
 *
 * @param counterId - Номер счётчика.
 * @param link - Адрес ссылки.
 * @param title - Заголовок страницы.
 *
 * @example
 * extLink('123456', 'https://example.com');
 */
export function extLink(counterId: string, link: string, title?: string): void {
    if (link) {
        hitExt({
            browserInfo: { ar: true, ln: true },
            counterId,
            pageParams: {
                referrer: getPageUrl(),
                title: title !== undefined ? title : getTitle(),
                url: link,
                ut: 'noindex'
            }
        });
    }
}

/**
 * Загрузка файла.
 *
 * @param counterId - Номер счётчика.
 * @param file - Ссылка на файл.
 * @param title - Заголовок страницы.
 *
 * @example
 * file('123456', 'https://mysite.com/file.zip');
 */
export function file(counterId: string, file: string, title?: string): void {
    if (file) {
        hitExt({
            browserInfo: {
                ar: true,
                dl: true,
                ln: true
            },
            counterId,
            pageParams: {
                referrer: getPageUrl(),
                title: title !== undefined ? title : getTitle(),
                url: file
            }
        });
    }
}

/**
 * Параметры визитов.
 *
 * @param counterId - Номер счётчика.
 * @param data - Параметры визитов.
 *
 * @example
 * params('123456', { myParam: 'value' });
 */
export function params(counterId: string, data: LyamParams): void {
    if (data) {
        hitExt({
            browserInfo: { ar: true, pa: true },
            counterId,
            pageParams: {},
            params: data
        });
    }
}

/**
 * Параметры посетителей сайта.
 *
 * @param counterId - Номер счётчика.
 * @param data - Параметры.
 *
 * @example
 * userParams('123456', { myParam: 'value', UserID: 123 });
 */
export function userParams(counterId: string, data: LyamParams): void {
    if (data) {
        hitExt({
            browserInfo: { ar: true, pa: true },
            counterId,
            pageParams: {},
            params: {
                __ymu: data,
            }
        });
    }
}

/**
 * Не отказ.
 *
 * @param counterId - Номер счётчика.
 *
 * @example
 * notBounce('123456');
 */
export function notBounce(counterId: string): void {
    hitExt({
        browserInfo: { ar: true, nb: true },
        counterId,
        pageParams: {}
    });
}
