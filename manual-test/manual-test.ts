import { hit, reachGoal, params, extLink, userParams, file } from '../src/index';

const counterId = '55669909';

hit(counterId, {
    title: 'My Title',
    referrer: 'https://google.ru',
    url: 'https://example.com/index.html'
}, { myHitParam: 456 });

reachGoal(counterId, 'notificationClick', { myGoalParam: 123 });

file(counterId, 'https://mysite.com/file.zip')

extLink(counterId, 'https://yandex.ru');

params(counterId, { myParam: 1});

userParams(counterId, { myParam: 'value', UserID: 123 });
