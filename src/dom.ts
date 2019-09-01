const hasDocument = typeof document !== 'undefined';
const hasWindow = typeof window !== 'undefined';

export function getCharset(): string {
    return hasDocument ? document.charset : '';
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
