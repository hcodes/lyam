import {normalizeOrigin, queryStringify} from './url';
import type { LyamQueryParams } from './index';

interface LyamTransportConfigParams {
    metrikaOrigin: string;
}

const DEFAULT_METRIKA_ORIGIN = 'https://mc.yandex.ru';

let metrikaOrigin = DEFAULT_METRIKA_ORIGIN;

/**
 * Конфигурирует транспорт отправки событий.
 *
 * Принимается только https-адрес: без схемы получился бы относительный URL,
 * и события молча ушли бы на домен самого сайта. Поэтому при неверном значении
 * остаётся адрес по умолчанию, а ошибка выводится в `console.error`.
 *
 * @param params
 */
export function configureTransport(params: LyamTransportConfigParams): void {
    const origin = normalizeOrigin(params.metrikaOrigin);

    if (!/^https:\/\/[^/?#]/.test(origin)) {
        console.error(
            '[lyam] configureTransport: metrikaOrigin must be a full "https://" address, ' +
            'falling back to ' + DEFAULT_METRIKA_ORIGIN
        );

        return;
    }

    metrikaOrigin = origin;
}

export function sendData(counterId: string, queryParams: LyamQueryParams): void {
    const url = metrikaOrigin + '/watch/' + counterId + '?' + queryStringify(queryParams);
    const hasBeacon = typeof navigator !== 'undefined' && navigator.sendBeacon;

    if (!hasBeacon || !navigator.sendBeacon(url, ' ')) {
        if (typeof fetch !== 'undefined') {
            fetch(url, { credentials: 'include' }).catch(function() {/** unhandled rejection off */});

        } else if (typeof Image !== 'undefined') {
            new Image().src = url;
        }
    }
}
