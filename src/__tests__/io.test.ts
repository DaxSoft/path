import { describe, expect, it } from 'vitest';

import { default as PathRoute } from '../path/index';

const TestRoute = new PathRoute();
TestRoute.add('main', __dirname);
TestRoute.add('@', TestRoute.backward('main', 2));

const FILENAME_TEST = '__vite.test.txt';
const FILENAME_DATA_TEST = new Date().toDateString();
const FOLDERPATH_TEST = 'viteTestFolder';

describe('PathFileManager', () => {
    it('isFileValid', async () => {
        const packageJsonFilepath = TestRoute.plug('@', 'package.json');
        const isValid = await TestRoute.io().isFileValid(
            packageJsonFilepath || ''
        );
        expect(isValid).toBe(true);
    });

    it('write', async () => {
        const newFile = await TestRoute.io().write(
            TestRoute.plug('main', FILENAME_TEST) || '',
            FILENAME_DATA_TEST
        );
        expect(newFile).toBe(true);
    });

    it('read', async () => {
        const file = await TestRoute.io().read(
            TestRoute.plug('main', FILENAME_TEST) || ''
        );
        if (file) {
            const date = new Date(file.trim());
            expect(
                date.getDate() === new Date(FILENAME_DATA_TEST).getDate()
            ).toBe(true);
        }
    });

    it('copy', async () => {
        const source = TestRoute.plug('main', FILENAME_TEST) || '';
        const target = source.replace('__vite', '__copy');
        const cp = await TestRoute.io().copy(source, target);
        expect(cp).toBe(true);
    });

    it('remove', async () => {
        const source = TestRoute.plug('main', FILENAME_TEST) || '';
        const target = source.replace('__vite', '__copy');

        const deleteSouce = await TestRoute.io().remove(source);
        const deleteTarget = await TestRoute.io().remove(target);

        expect(deleteSouce && deleteTarget).toBe(true);
    });

    it('createFolder', async () => {
        const folderpath = TestRoute.plug('main', FOLDERPATH_TEST) || '';
        const createFolder = await TestRoute.io().createFolder(folderpath);
        expect(createFolder).toBe(true);
    });

    it('isFolderValid', async () => {
        const folderpath = TestRoute.plug('main', FOLDERPATH_TEST) || '';
        const isFolderValid = await TestRoute.io().isFolderValid(folderpath);
        expect(isFolderValid).toBe(true);
    });

    it('removeFolder', async () => {
        const folderpath = TestRoute.plug('main', FOLDERPATH_TEST) || '';
        const removeFolder = await TestRoute.io().removeFolder(folderpath);
        expect(removeFolder).toBe(true);
    });
});
