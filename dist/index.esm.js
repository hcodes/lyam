const hasDocument = typeof document !== 'undefined';
const hasWindow = typeof window !== 'undefined';
const hasNavigator = typeof navigator != 'undefined';
const hasScreen = typeof screen != 'undefined';
function getCharset() {
    return hasDocument ? document.charset : '';
}
function getHost() {
    return hasWindow ? window.location.hostname : '';
}
function getPageUrl() {
    return hasWindow ? window.location.href : '';
}
function getReferrer() {
    return hasDocument ? document.referrer : '';
}
function getTitle() {
    return hasDocument ? document.title : '';
}
function cookieEnabled() {
    return hasNavigator ? navigator.cookieEnabled : false;
}
function getScreenSize() {
    return hasScreen ? [
        screen.width,
        screen.height,
        screen.colorDepth
    ].join('x') : '';
}

function truncate(str, len) {
    return (str || '').slice(0, len);
}

function getRandom() {
    return Math.floor(Math.random() * 1E6);
}

const MAX_TITLE_LEN = 512;
function addParam(result, name, value) {
    if (value || value === 0) {
        result.push(name + ':' + (value === true ? '1' : value));
    }
}
function getBrowserInfo(params, title) {
    const result = [];
    if (params) {
        Object.keys(params).forEach((key) => addParam(result, key, params[key]));
    }
    addParam(result, 'rn', getRandom());
    addParam(result, 'c', cookieEnabled());
    addParam(result, 's', getScreenSize());
    addParam(result, 'en', getCharset());
    addParam(result, 't', truncate(title, MAX_TITLE_LEN));
    return result.join(':');
}

function queryStringify(params) {
    return Object.keys(params)
        .filter(function (key) {
        const val = params[key];
        return val !== '' && val !== undefined && val !== null;
    })
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
        .join('&');
}
const MAX_URL_LEN = 1024;
function prepareUrl(url) {
    return truncate(url, MAX_URL_LEN);
}

function sendData(counterId, queryParams) {
    const url = 'https://mc.yandex.ru/watch/' + counterId + '?' + queryStringify(queryParams);
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        navigator.sendBeacon(url, ' ');
    }
    else if (typeof fetch !== 'undefined') {
        fetch(url, { credentials: 'include' });
    }
    else if (typeof Image !== 'undefined') {
        new Image().src = url;
    }
}

function hitExt(params) {
    const { browserInfo, counterId, pageParams, userVars } = params;
    const data = {
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
function hit(counterId, hitParams, userVars) {
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
function reachGoal(counterId, name, userVars) {
    let referrer;
    let url;
    if (name) {
        referrer = getPageUrl();
        url = `goal://${getHost()}/${name}`;
    }
    else {
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
function extLink(counterId, link, title) {
    if (link) {
        hitExt({
            browserInfo: { ln: true },
            counterId,
            pageParams: {
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
function file(counterId, file, title) {
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
function userVars(counterId, data) {
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
function notBounce(counterId) {
    hitExt({
        browserInfo: { nb: true },
        counterId,
        pageParams: {}
    });
}

export { extLink, file, hit, hitExt, notBounce, reachGoal, userVars };
