import { getBrowserInfo } from './browserInfo';
import { getTitle, getPageUrl, getReferrer, getHost } from './dom';
import { getRandom } from './number';
import { sendData } from './transport';
import { prepareUrl } from './url';

export function hitExt(params: Lyam.HitExtParams): void {
    const {
        browserInfo,
        counterId,
        pageParams,
        userVars
    } = params;

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

    if (userVars) {
        data['site-info'] = JSON.stringify(userVars);
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
export function hit(counterId: string, hitParams?: Lyam.HitParams, userVars?: Lyam.UserVars): void {
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
 * @param counterId - Номер счётчика.
 * @param name - Название цели.
 * @param userVars - Параметры визитов.
 *
 * @example
 * reachGoal('123456', 'goalName');
*/
export function reachGoal(counterId: string, name?: string, userVars?: Lyam.UserVars): void {
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
        counterId,
        pageParams: { referrer, url },
        userVars
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
            browserInfo: { ln: true },
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
 * userVars('123456', { myParam: 'value' });
 */
export function userVars(counterId: string, data: Lyam.UserVars): void {
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
export function notBounce(counterId: string): void {
    hitExt({
        browserInfo: { nb: true },
        counterId,
        pageParams: {}
    });
}
