import { describe, expect, it } from 'vitest';

import { default as PathRoute } from '../path/index';

const TestRoute = new PathRoute();
TestRoute.add('main', __dirname);

const FILENAME_TEST = '__vite.test.stream.txt';
const FILENAME_DATA_TEST = '@vorlefan';
const URL_DOWNLOAD = 'https://avatars.githubusercontent.com/u/6865744?v=4';

describe('PathStreamManager', () => {
    it('download', async () => {
        const dest = TestRoute.plug('main', 'github_profile.png') || '';
        const download = await TestRoute.stream().download(
            URL_DOWNLOAD,
            dest,
            'https'
        );
        expect(download).toBe(true);

        const hasFile = await TestRoute.io().isFileValid(dest);
        expect(hasFile).toBe(true);

        const clean = await TestRoute.io().remove(dest);
        expect(clean).toBe(true);
    });

    it('write', async () => {
        const write = await TestRoute.stream().write(
            TestRoute.plug('main', FILENAME_TEST) || '',
            FILENAME_DATA_TEST
        );
        expect(write).toBe(true);
    });

    it('read and clean', async () => {
        const filepath = TestRoute.plug('main', FILENAME_TEST) || '';
        const read = (await TestRoute.stream().read(filepath)) || '';
        expect(/^@/.test(read)).toBe(true);

        const clean = await TestRoute.io().remove(filepath);
        expect(clean).toBe(true);
    });
});
