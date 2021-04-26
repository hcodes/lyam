'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var hasDocument = typeof document !== 'undefined';
var hasWindow = typeof window !== 'undefined';
var hasNavigator = typeof navigator != 'undefined';
var hasScreen = typeof screen != 'undefined';
function getCharset() {
    return hasDocument && typeof document.charset === 'string' ?
        document.charset.toLowerCase() :
        '';
}
function getHost() {
    return hasWindow && window.location ? window.location.hostname : '';
}
function getPageUrl() {
    return hasWindow && window.location ? window.location.href : '';
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
function getClientSize() {
    return hasWindow ? [
        window.innerWidth,
        window.innerHeight
    ].join('x') : '';
}

function truncate(str, len) {
    return (str || '').slice(0, len);
}

function getRandom() {
    return Math.floor(Math.random() * (1 << 31 - 1));
}

function getSeconds() {
    return Math.round(Date.now() / 1000);
}

var MAX_TITLE_LEN = 512;
function addParam(result, name, value) {
    if (value || value === 0) {
        result.push(name + ':' + (value === true ? '1' : value));
    }
}
function getBrowserInfo(params, title) {
    var result = [];
    if (params) {
        Object.keys(params).forEach(function (key) { return addParam(result, key, params[key]); });
    }
    addParam(result, 'rn', getRandom());
    addParam(result, 'c', cookieEnabled());
    addParam(result, 's', getScreenSize());
    addParam(result, 'w', getClientSize());
    addParam(result, 'en', getCharset());
    var time = getSeconds();
    addParam(result, 'et', time);
    addParam(result, 'st', time);
    addParam(result, 't', truncate(title, MAX_TITLE_LEN));
    return result.join(':');
}

function queryStringify(params) {
    return Object.keys(params)
        .filter(function (key) { return params[key] || params[key] === 0; })
        .map(function (key) { return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]); })
        .join('&');
}
var MAX_URL_LEN = 1024;
function prepareUrl(url) {
    return truncate(url, MAX_URL_LEN);
}

function sendData(counterId, queryParams) {
    var url = 'https://mc.yandex.ru/watch/' + counterId + '?' + queryStringify(queryParams);
    var hasBeacon = typeof navigator !== 'undefined' && navigator.sendBeacon;
    if (!hasBeacon || !navigator.sendBeacon(url, ' ')) {
        if (typeof fetch !== 'undefined') {
            fetch(url, { credentials: 'include' });
        }
        else if (typeof Image !== 'undefined') {
            new Image().src = url;
        }
    }
}

function hitExt(hitExtParams) {
    var browserInfo = hitExtParams.browserInfo, counterId = hitExtParams.counterId, pageParams = hitExtParams.pageParams, params = hitExtParams.params;
    var data = {
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
function hit(counterId, hitParams, params) {
    var referrer = hitParams && hitParams.referrer !== undefined ?
        hitParams.referrer :
        getReferrer();
    var title = hitParams && hitParams.title !== undefined ?
        hitParams.title :
        getTitle();
    var url = hitParams && hitParams.url !== undefined ?
        hitParams.url :
        getPageUrl();
    hitExt({
        browserInfo: { pv: true, ar: true },
        counterId: counterId,
        pageParams: {
            referrer: referrer,
            title: title,
            url: url
        },
        params: params
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
function reachGoal(counterId, name, params) {
    var referrer;
    var url;
    if (name) {
        referrer = getPageUrl();
        url = "goal://" + getHost() + "/" + name;
    }
    else {
        referrer = getReferrer();
        url = getPageUrl();
    }
    hitExt({
        browserInfo: { ar: true },
        counterId: counterId,
        pageParams: { referrer: referrer, url: url },
        params: params,
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
            browserInfo: { ar: true, ln: true },
            counterId: counterId,
            pageParams: {
                referrer: getPageUrl(),
                title: title,
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
                ar: true,
                dl: true,
                ln: true
            },
            counterId: counterId,
            pageParams: {
                referrer: getReferrer(),
                title: title,
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
function params(counterId, data) {
    if (data) {
        hitExt({
            browserInfo: { ar: true, pa: true },
            counterId: counterId,
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
function userParams(counterId, data) {
    if (data) {
        hitExt({
            browserInfo: { ar: true, pa: true },
            counterId: counterId,
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
function notBounce(counterId) {
    hitExt({
        browserInfo: { ar: true, nb: true },
        counterId: counterId,
        pageParams: {}
    });
}

exports.extLink = extLink;
exports.file = file;
exports.hit = hit;
exports.hitExt = hitExt;
exports.notBounce = notBounce;
exports.params = params;
exports.reachGoal = reachGoal;
exports.userParams = userParams;
