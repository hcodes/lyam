const hasDocument = typeof document !== 'undefined';
const hasWindow = typeof window !== 'undefined';
const hasNavigator = typeof navigator != 'undefined';
const hasScreen =  typeof screen != 'undefined';

export function getCharset(): string {
    return hasDocument && typeof document.charset === 'string' ?
        document.charset.toLowerCase() :
        '';
}

export function getHost(): string {
    return hasWindow && window.location ? window.location.hostname : '';
}

export function getPageUrl(): string {
    return hasWindow && window.location ? window.location.href : '';
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

const DEFAULT_DEVICE_PIXEL_RATIO = 1;
export function getDevicePixelRatio(): number {
    return hasWindow ?
        (window.devicePixelRatio || DEFAULT_DEVICE_PIXEL_RATIO) :
        DEFAULT_DEVICE_PIXEL_RATIO;
}

export function getClientSize(): string {
    return hasWindow ? [
        window.innerWidth,
        window.innerHeight
    ].join('x') : '';
}
