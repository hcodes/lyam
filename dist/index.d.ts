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
    requestParams?: LyamQueryParams;
    params?: LyamParams;
}
export declare function hitExt(hitExtParams: LyamHitExtParams): void;
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
export declare function hit(counterId: string, hitParams?: LyamHitParams, params?: LyamParams): void;
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
export declare function reachGoal(counterId: string, name?: string, params?: LyamParams): void;
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
export declare function extLink(counterId: string, link: string, title?: string): void;
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
export declare function file(counterId: string, file: string, title?: string): void;
/**
 * Параметры визитов.
 *
 * @param counterId - Номер счётчика.
 * @param data - Параметры визитов.
 *
 * @example
 * params('123456', { myParam: 'value' });
 */
export declare function params(counterId: string, data: LyamParams): void;
/**
 * Параметры посетителей сайта.
 *
 * @param counterId - Номер счётчика.
 * @param data - Параметры.
 *
 * @example
 * userParams('123456', { myParam: 'value', UserID: 123 });
 */
export declare function userParams(counterId: string, data: LyamParams): void;
/**
 * Не отказ.
 *
 * @example
 * notBounce('123456');
 */
export declare function notBounce(counterId: string): void;
