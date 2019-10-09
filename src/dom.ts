const hasDocument = typeof document !== 'undefined';
const hasWindow = typeof window !== 'undefined';
const hasNavigator = typeof navigator != 'undefined';
const hasScreen =  typeof screen != 'undefined';

export function getCharset(): string {
    return hasDocument ? document.charset.toLowerCase() : '';
}

export function getHost(): string {
    return hasWindow ? window.location.hostname : '';
}

export function getPageUrl(): string {
    return hasWindow ? window.location.href : '';
}

export function getReferrer(): string {
    return hasDocument ? document.referrer : '';
}

export function getTitle(): string {
    return hasDocument ? document.title : '';
}

export function cookieEnabled(): boolean {
    return hasNavigator ? navigator.cookieEnabled : false;
}

export function getScreenSize(): string {
    return hasScreen ? [
        screen.width,
        screen.height,
        screen.colorDepth
    ].join('x') : '';
}
