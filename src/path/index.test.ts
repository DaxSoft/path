import { describe, expect, it, vi } from 'vitest';

import { default as PathRoute } from './index';

const TestRoute = new PathRoute();

describe('PathRoute', () => {
    it('Has zero routes initialized', () => {
        expect(TestRoute.routes().length).toBe(0);
    });

    it('Expect to do not have the route named x', () => {
        expect(TestRoute.has('x')).toBe(false);
    });
});
