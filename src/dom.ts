// Среду проверяем в каждом вызове, а не один раз при импорте: `window` и
// `document` могут появиться позже загрузки модуля (SSR, отложенная
// инициализация тестовой среды), и зафиксированный флаг навсегда оставил бы
// свойства страницы пустыми.
export function getCharset(): string {
    return typeof document !== 'undefined' && typeof document.charset === 'string' ?
        document.charset.toLowerCase() :
        '';
}

export function getHost(): string {
    return typeof window !== 'undefined' && window.location ? window.location.hostname : '';
}

export function getPageUrl(): string {
    return typeof window !== 'undefined' && window.location ? window.location.href : '';
}

export function getReferrer(): string {
    return typeof document !== 'undefined' ? document.referrer : '';
}

export function getTitle(): string {
    return typeof document !== 'undefined' ? document.title : '';
}

export function cookieEnabled(): boolean {
    return typeof navigator !== 'undefined' ? Boolean(navigator.cookieEnabled) : false;
}

export function getScreenSize(): string {
    return typeof screen !== 'undefined' ? [
        screen.width,
        screen.height,
        screen.colorDepth
    ].join('x') : '';
}

const DEFAULT_DEVICE_PIXEL_RATIO = 1;
export function getDevicePixelRatio(): number {
    return typeof window !== 'undefined' ?
        (window.devicePixelRatio || DEFAULT_DEVICE_PIXEL_RATIO) :
        DEFAULT_DEVICE_PIXEL_RATIO;
}

export function getClientSize(): string {
    return typeof window !== 'undefined' ? [
        window.innerWidth,
        window.innerHeight
    ].join('x') : '';
}
