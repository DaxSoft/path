import { describe, expect, it, vi } from 'vitest';
import path from 'node:path';

import { default as PathRoute } from './index';

const TestRoute = new PathRoute();

describe('PathRoute', () => {
    it('Has zero routes initialized', () => {
        expect(TestRoute.size()).toBe(0);
    });

    it('Expect to do not have the route named x', () => {
        expect(TestRoute.has('x')).toBe(false);
    });

    it('It should add a route named x', () => {
        expect(TestRoute.add('x', './').has('x')).toBe(true);
    });

    it('The x route should returns the path of ./', () => {
        expect(TestRoute.get('x')?.routePath).toBe('./');
    });

    it('It should have 2 routes', () => {
        expect(TestRoute.add('y', '../').size()).toBe(2);
    });

    it('It should delete the route named x', () => {
        expect(TestRoute.remove('x').has('x')).toBe(false);
    });

    it('It should create an alias from y route and returns the same path as y route', () => {
        const alias = TestRoute.alias('z', 'y').get('z');
        const y = TestRoute.get('y');

        expect(alias?.routeName).toBe('z');
        expect(alias?.routePath === y?.routePath).toBe(true);
    });

    it('It should be able to join the example route to the y route and returns the path joined', () => {
        const example = TestRoute.join('example', 'y').get('example');
        expect(example?.routePath).toBe(
            path.join(
                TestRoute.get('y')?.routePath || '',
                example?.routeName || ''
            )
        );
    });
});
