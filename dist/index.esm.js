const hasDocument = typeof document !== 'undefined';
const hasWindow = typeof window !== 'undefined';
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

function truncate(str, len) {
    return (str || '').slice(len);
}

const MAX_TITLE_LEN = 512;
function getParam(name, value) {
    return name + ':' + (value === true ? '1' : value);
}
function addParam(result, name, value) {
    if (value !== '' && value !== false && value !== undefined && value !== null) {
        result.push(getParam(name, value));
    }
}
function getBrowserInfo(params, title) {
    const result = [];
    Object.keys(params).forEach((key) => addParam(result, key, params[key]));
    addParam(result, 'en', getCharset());
    addParam(result, 'rn', Math.floor(Math.random() * 1E6));
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

const METRIKA_URL = 'https://mc.yandex.ru/watch/';
function sendData(counterId, queryParams) {
    const url = METRIKA_URL
        + counterId
        + '?rn=' + (Math.floor(Math.random() * 1E6))
        + '&' + queryStringify(queryParams);
    if (typeof navigator && navigator.sendBeacon) {
        navigator.sendBeacon(url, ' ');
    }
    else if (typeof fetch !== 'undefined') {
        fetch(url);
    }
    else if (typeof Image !== 'undefined') {
        new Image().src = url;
    }
}

const MAX_URL_LEN = 1024;
function hitExt(params) {
    const { browserInfo, counterId, pageParams, requestParams, userVars } = params;
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
 * @param {string} counterId - Номер счётчика.
 * @param {string} name - Название цели.
 * @param {Object} [userParams] - Параметры визитов.
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
 * @param {string} counterId - Номер счётчика.
 * @param {string} link - Адрес ссылки.
 * @param {string} [title] - Заголовок страницы.
 *
 * @example
 * extLink('https://example.com');
 */
function extLink(counterId, link, title) {
    if (link) {
        hitExt({
            browserInfo: { ln: true },
            counterId,
            pageParams: {
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
 * @param {string} counterId - Номер счётчика.
 * @param {...*} data - Параметры визитов.
 *
 * @example
 * userVars(counterId, { myParam: 'value' });
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
