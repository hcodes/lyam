import { hit, reachGoal } from '../src/index';

const counterId = '55669909';

hit(counterId, {
    title: 'My Title',
    referrer: 'https://google.ru',
    url: 'https://example.com/index.html'
}, { myHitParam: 456 });

reachGoal(counterId, 'notificationClick', { myGoalParam: 123 });
