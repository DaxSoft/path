'use strict';

/**
 * @description Basic usage of this module.
 * This will take at account this folder (module folder),
 * as example.
 */

const { Routes, Route } = require('../src');

// Create a new route instance and give it a name

Routes.instance((instance) => {
    instance.set('src', instance.resolve(__dirname, '..'));
    instance.join('test', 'src');
    instance.join('examples', 'src');
}).namespace('Basic');

// test

describe('Test Basic Example of Route', () => {
    test('namespace', () => {
        expect(Routes.route.hasOwnProperty('Basic')).toBe(true);
        expect(Route.hasOwnProperty('Basic')).toBe(true);
    });

    test('routes', () => {
        expect(Route.Basic.has('src')).toBe(true);
        expect(Route.Basic.has('test')).toBe(true);
        expect(Route.Basic.has('examples')).toBe(true);
    });
});
