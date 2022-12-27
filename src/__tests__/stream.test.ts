import { describe, expect, it } from 'vitest';

import { default as PathRoute } from '../path/index';

const TestRoute = new PathRoute();
TestRoute.add('main', __dirname);
TestRoute.add('@', TestRoute.backward('main', 2));

const FILENAME_TEST = '__vite.test.json';
const FILENAME_DATA_TEST = {
    x: 1,
    y: 5,
};

describe('PathStreamManager', () => {
    it('read', async () => {
        const packageJsonFilepath = TestRoute.plug('@', 'package.json');
        const read = await TestRoute.json().read(packageJsonFilepath || '');
        expect(read?.name).toBe('@vorlefan/path');
    });

    it('write', async () => {
        const write = await TestRoute.json().write(
            TestRoute.plug('main', FILENAME_TEST) || '',
            FILENAME_DATA_TEST
        );
        expect(write).toBe(true);
    });

    it('read and clean', async () => {
        const filepath = TestRoute.plug('main', FILENAME_TEST) || '';
        const read = await TestRoute.json().read(filepath);
        expect(read?.x + read?.y).toBe(6);

        const clean = await TestRoute.io().remove(filepath);
        expect(clean).toBe(true);
    });
});
