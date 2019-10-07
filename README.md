# Лёгкая Я.Метрика

## Мотивация
[Скрипт Метрики](https://mc.yandex.ru/metrika/tag.js) занимает более 90 КБ, для лёгких страниц и небольших пакетов он громозкий.

## Преимущества
- Сверхмалый размер кода.
- Код подключается в основной бандл проекта, нет дополнительного запроса на загрузку скрипта Метрики.
- Использование в serviceWorker, электрон-приложениях и т.д.

## Использование

```js
import { hit } from 'lyam';

hit('12345'); // Тоже самое, что и hit('12345', { url: window.location.href, title: document.title, referrer: document.referrer });

// or

hit('12345', {
  referrer: 'https://anothersite.ru',
  title: 'My document title',
  url: 'https://mysite.ru'
});

```


## Отправка цели

```js
import { hit, reachGoal } from 'lyam';

const counterId = '12345';
hit(counterId);

// ...

reachGoal(counterId, 'MY_GOAL');
```

## Лицензия
MIT
