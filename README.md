# Лёгкая Я.Метрика

[![NPM version](https://img.shields.io/npm/v/lyam.svg)](https://www.npmjs.com/package/lyam)
[![NPM Downloads](https://img.shields.io/npm/dm/lyam.svg?style=flat)](https://www.npmjs.org/package/lyam)
[![install size](https://packagephobia.com/badge?p=lyam)](https://packagephobia.com/result?p=lyam)

## Мотивация
[Скрипт Метрики](https://mc.yandex.ru/metrika/tag.js) занимает более 350 КБ (90 КБ в GZIP), для лёгких страниц и небольших пакетов он громоздкий.

<img width="350" src="https://raw.githubusercontent.com/hcodes/lyam/refs/heads/master/images/feather.jpg" />

## Преимущества

- **Сверхмалый размер кода**: библиотека содержит функции для отправки основных событий без полного клиентского скрипта Метрики. [Посмотреть размер на Bundlephobia](https://bundlephobia.com/package/lyam).
- **Без отдельной загрузки `tag.js`**: `lyam` импортируется как обычная зависимость и может быть включён в основной бандл проекта. Тогда браузеру не нужно дополнительно запрашивать и разбирать скрипт Метрики; сами события по-прежнему отправляются сетевыми запросами.
- **Работа без DOM**: события можно отправлять из Service Worker и приложений на Electron, если явно передать данные страницы и в среде доступен `fetch`.
- **Типизированный API**: хиты, цели, внешние ссылки и загрузки файлов отправляются через отдельные функции; определения типов TypeScript входят в пакет.
- **Настраиваемый адрес отправки**: через `configureTransport` можно выбрать международный домен Метрики.

## Использование

### Просмотр страницы

`hit(counterId)` отправляет в Метрику просмотр текущей страницы. `counterId` — номер счётчика Метрики.

```js
import { hit } from 'lyam';

const counterId = '12345';

// Если не указаны параметры, то адрес страницы берётся из location.href,
// заголовок страницы из document.title и
// реферер из document.referrer.
hit(counterId);
```

Со всеми параметрами:
```js
import { hit } from 'lyam';

const counterId = '12345';
const userVars = { myParam: 123 };

hit(counterId, {
  referrer: 'https://anothersite.ru',
  title: 'My document title',
  url: 'https://mysite.ru'
}, userVars);
```

### Service Worker

В Service Worker нет `window` и `document`, поэтому `hit(counterId)` не сможет взять URL, заголовок и реферер страницы автоматически. Передавайте URL отслеживаемой страницы явно, получив его от клиента:

```js
import { hit } from 'lyam';

hit('12345', { url: 'https://mysite.ru/current-page', title: 'Page title' });
```

### Отправка цели

```js
import { hit, reachGoal } from 'lyam';

const counterId = '12345';
hit(counterId);

// ...

reachGoal(counterId, 'MY_GOAL_NAME');

```

### Отправка цели с параметрами визита

```js
import { hit, reachGoal } from 'lyam';

const counterId = '12345';
hit(counterId);

// ...

const userVars = { myParam: 123 };
reachGoal(counterId, 'MY_GOAL_NAME', userVars);

```

### Внешняя ссылка
```js
import { hit, extLink } from 'lyam';

const counterId = '12345';
hit(counterId);

// ...

extLink(counterId, 'https://externalsite.ru');
```

### Загрузка файла
```js
import { hit, file } from 'lyam';

const counterId = '12345';
hit(counterId);

// ...

file(counterId, 'https://mysite.ru/file.zip');
```

### Не отказ
```js
import { hit, notBounce } from 'lyam';

const counterId = '12345';
hit(counterId);

// ...

setTimeout(() => {
    notBounce(counterId);
}, 15000); // 15 сек.
```

### Параметры визита
```js
import { hit, params } from 'lyam';

const counterId = '12345';
hit(counterId);

// ...

params(counterId, { myParam: 123 });
```

### Пользовательские параметры
```js
import { hit, userParams } from 'lyam';

const counterId = '12345';
hit(counterId);

// ...

userParams(counterId, { myParam: 1, UserID: 12345 });
```

### Международный домен Метрики

По умолчанию запросы отправляются на `https://mc.yandex.ru`. Чтобы использовать [альтернативный домен Метрики](https://yandex.com/support/metrica/en/general/alternative-domain), задайте его адрес до отправки событий:

```js
import { configureTransport, hit } from 'lyam';

configureTransport({ metrikaOrigin: 'https://mc.yandex.com' });
hit('12345');
```

Настройка действует на все последующие события. К указанному адресу библиотека добавляет путь `/watch/<counterId>`.

## CSP
```
Content-Security-Policy:
  ...
  img-src https://mc.yandex.ru;
  connect-src https://mc.yandex.ru;
  ...
```

Если используется `https://mc.yandex.com`, добавьте этот адрес в `connect-src` и `img-src`.

## [Лицензия](./LICENSE)
MIT

## Ссылки
- [React/Preact-компонент для Яндекс Метрики](https://github.com/hcodes/react-metrika)
