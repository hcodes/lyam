# Лёгкая Я.Метрика

## Мотивация
[Скрипт Метрики](https://mc.yandex.ru/metrika/tag.js) занимает более 350 КБ (90 КБ в GZIP), для лёгких страниц и небольших пакетов он громоздкий.

## Преимущества
- Сверхмалый размер кода.
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

## Отправка цели

```js
import { hit, reachGoal } from 'lyam';

const counterId = '12345';
hit(counterId);

// ...

reachGoal(counterId, 'MY_GOAL_NAME');

```

## Отправка цели с параметрами визита

```js
import { hit, reachGoal } from 'lyam';

const counterId = '12345';
hit(counterId);

// ...

const userVars = { myParam: 123 };
reachGoal(counterId, 'MY_GOAL_NAME', userVars);

```

## Внешняя ссылка
```js
import { hit, extLink } from 'lyam';

const counterId = '12345';
hit(counterId);

// ...

extLink('https://externalsite.ru');
```

## Загрузка файла
```js
import { hit, file } from 'lyam';

const counterId = '12345';
hit(counterId);

// ...

file('https://mysite.ru/file.zip');
```

## Не отказ
```js
import { hit, notBounce } from 'lyam';

const counterId = '12345';
hit(counterId);

// ...

setTimeout(notBounce, 15000); // 15 сек.
```

## Параметры визита
```js
import { hit, userVars } from 'lyam';

const counterId = '12345';
hit(counterId);

// ...

userVars({ myParam: 123 });
```

## Лицензия
MIT
