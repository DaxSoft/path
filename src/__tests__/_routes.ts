// Defines the routes for test

import { Route, Routes } from '..';

Routes.instance(({ instance }) => {
    instance.set('main', instance.resolve(__dirname, '..', '..'));
    instance.join('src', 'main');
    instance.join('__tests__', 'src');
    instance.alias('developer', 'src');
    instance.join('node_modules', 'src');
}, 'Test');

export { Route };

test('bypass', () => expect(true).toBe(true));
