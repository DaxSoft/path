'use strict';

const { Routes, Route } = require('../src');

// Create a new route instance and give it a name

Routes.instance((instance) => {
    instance.set('main', instance.resolve(__dirname, '..'));

    instance.join('src', 'main');
    instance.join('features', 'src');

    instance.join('test', 'main');
    instance.join('examples', 'main');
}).namespace('Basic');

describe('back & endWith', () => {
    test('1 level', () => {
        expect(Route.Basic.endWith(Route.Basic.back('features', 1))).toBe(
            'src'
        );
    });

    test('2 level', () => {
        expect(Route.Basic.endWith(Route.Basic.back('features', 2))).toBe(
            'path'
        );
    });
});
