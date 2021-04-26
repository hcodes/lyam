import { getBrowserInfo } from './browserInfo';
import { getTitle, getPageUrl, getReferrer, getHost } from './dom';
import { getRandom } from './number';
import { sendData } from './transport';
import { prepareUrl } from './url';

export function hitExt(hitExtParams: Lyam.HitExtParams): void {
    const {
        browserInfo,
        counterId,
        pageParams,
        params,
    } = hitExtParams;

    const data: Lyam.QueryParams = {
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
        data['site-info'] = JSON.stringify(params);
    }

    sendData(counterId, data);
}

/**
 * Отправка хита.
 *
 * @param counterId - Номер счётчика.
 * @param hitParams -  Параметры страницы.
 * @param userVars - Параметры визитов.
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
export function hit(counterId: string, hitParams?: Lyam.HitParams, params?: Lyam.Params): void {
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
            url
        },
        params
    });
}

/**
 * Достижение цели.
 *
 * @param counterId - Номер счётчика.
 * @param name - Название цели.
 * @param userVars - Параметры визитов.
 *
 * @example
 * reachGoal('123456', 'goalName');
*/
export function reachGoal(counterId: string, name?: string, params?: Lyam.Params): void {
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
 * extLink('12356', 'https://example.com');
 */
export function extLink(counterId: string, link: string, title?: string): void {
    if (link) {
        hitExt({
            browserInfo: { ar: true, ln: true },
            counterId,
            pageParams:  {
                referrer: getPageUrl(),
                title,
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
 * @param counterId - Номер счётчика.
 * @param data - Параметры визитов.
 *
 * @example
 * params('123456', { myParam: 'value' });
 */
export function params(counterId: string, data: Lyam.Params): void {
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
export function userParams(counterId: string, data: Lyam.Params): void {
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
