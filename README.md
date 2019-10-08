# Лёгкая Я.Метрика

[![NPM version](https://img.shields.io/npm/v/lyam.svg)](https://www.npmjs.com/package/lyam)
[![NPM Downloads](https://img.shields.io/npm/dm/lyam.svg?style=flat)](https://www.npmjs.org/package/lyam)
[![Dependency Status](https://img.shields.io/david/hcodes/lyam.svg)](https://david-dm.org/hcodes/lyam)
[![Known Vulnerabilities](https://snyk.io/test/github/hcodes/lyam/badge.svg)](https://snyk.io/test/github/hcodes/lyam)
[![Bundlephobia](https://badgen.net/bundlephobia/minzip/lyam)](https://bundlephobia.com/result?p=lyam)

## Мотивация
[Скрипт Метрики](https://mc.yandex.ru/metrika/tag.js) занимает более 350 КБ (90 КБ в GZIP), для лёгких страниц и небольших пакетов он громоздкий.

## Преимущества
- Сверхмалый размер кода, менее 900 байт в GZIP, с Tree Shaking ещё меньше.
- Код подключается в основной бандл проекта, нет дополнительного запроса на загрузку скрипта и парсинга кода Метрики.
- Использование в serviceWorker’е, электрон-приложениях и т.д.

## Использование

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
import { hit, userVars } from 'lyam';

const counterId = '12345';
hit(counterId);

// ...

userVars(counterId, { myParam: 123 });
```

## CSP
```
Content-Security-Policy:
  ...
  img-src https://mc.yandex.ru;
  connect-src https://mc.yandex.ru;
  ...
```

## Лицензия
MIT
