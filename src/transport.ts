import {normalizeOrigin, queryStringify} from './url';
import type { LyamQueryParams } from './index';

interface LyamTrasportConfigParams {
    metrikaOrigin: string;
}

let metrikaOrigin = 'https://mc.yandex.ru';

/**
 * Конфигурирует транспорт отправки событий
 * @param params
 */
export function configureTransport(params: LyamTrasportConfigParams) {
    metrikaOrigin = normalizeOrigin(params.metrikaOrigin);
}

export function sendData(counterId: string, queryParams: LyamQueryParams): void {
    const url =  metrikaOrigin + '/watch/' + counterId + '?' + queryStringify(queryParams);
    const hasBeacon = typeof navigator !== 'undefined' && navigator.sendBeacon;

    if (!hasBeacon || !navigator.sendBeacon(url, ' ')) {
        if (typeof fetch !== 'undefined') {
            fetch(url, { credentials: 'include' }).catch(function() {/** unhandled rejection off */});

        } else if (typeof Image !== 'undefined') {
            new Image().src = url;
        }
    }
}
