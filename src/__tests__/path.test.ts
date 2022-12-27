import { describe, expect, it } from 'vitest';
import path from 'node:path';

import { default as PathRoute } from '../path/index';

const TestRoute = new PathRoute();
TestRoute.add('main', __dirname);

describe('PathRoute', () => {
    it('size', () => {
        expect(TestRoute.size()).toBe(1);
    });

    it('has', () => {
        expect(TestRoute.has('x')).toBe(false);
    });

    it('add', () => {
        expect(TestRoute.add('x', './').has('x')).toBe(true);
    });

    it('get', () => {
        expect(TestRoute.get('x')?.routePath).toBe('./');
    });

    it('add+size', () => {
        expect(TestRoute.add('y', '../').size()).toBe(3);
    });

    it('remove', () => {
        expect(TestRoute.remove('x').has('x')).toBe(false);
    });

    it('edit', () => {
        expect(
            TestRoute.add('&', '../../t').edit('&', '../../edited').get('&')
                ?.routePath
        ).toBe('../../edited');
    });

    it('alias', () => {
        const alias = TestRoute.alias('z', 'y').get('z');
        const y = TestRoute.get('y');

        expect(alias?.routeName).toBe('z');
        expect(alias?.routePath === y?.routePath).toBe(true);
    });

    it('join', () => {
        const example = TestRoute.join('example', 'y').get('example');
        expect(example?.routePath).toBe(
            path.join(
                TestRoute.get('y')?.routePath || '',
                example?.routeName || ''
            )
        );
    });

    it('plug', () => {
        expect(TestRoute.plug('y', 'plug')).toBe(
            path.join(TestRoute.get('y')?.routePath || '', 'plug')
        );
    });

    it('sanitize', () => {
        expect(TestRoute.sanitize('example')).toBe('..\\example');
    });

    it('endsWith', () => {
        expect(
            TestRoute.endsWith(TestRoute.get('example')?.routePath || '')
        ).toBe('example');
    });

    it('backward', () => {
        expect(TestRoute.endsWith(TestRoute.backward('main') || '')).toBe(
            'src'
        );
    });

    it('towards', () => {
        const moveto = TestRoute.towards(
            TestRoute.get('main')?.routePath || '',
            'src'
        );
        expect(TestRoute.endsWith(moveto || '')).toBe('src');
    });

    it('hierarchy', () => {
        const hierarchy = TestRoute.hierarchy('main');
        expect(hierarchy.hasOwnProperty('src')).toBe(true);
    });

    it('files', async () => {
        const files = await TestRoute.files('main');
        const hasIoTest = files.find((d) => d.name === 'io.test');
        expect(hasIoTest?.extension).toBe('.ts');
    });

    it('allFilepaths', async () => {
        const allFilepaths = await TestRoute.allFilepaths(
            TestRoute.backward('main', 1) || ''
        );
        const itHasPathTestFile = allFilepaths.find(
            (d) => TestRoute.basename(d) === 'path.test.ts'
        );
        expect(!!itHasPathTestFile).toBe(true);
    });

    it('folders', async () => {
        const folders = await TestRoute.add(
            '@',
            TestRoute.backward('main', 2)
        ).folders('@');
        const hasSrcFolder = folders.find((d) => d.name === 'src');
        expect(hasSrcFolder?.name).toBe('src');
    });
});
