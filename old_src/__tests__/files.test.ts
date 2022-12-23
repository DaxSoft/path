import { Route } from './_routes';

describe('folder', () => {
    test('hasFolder', () => {
        expect(Route.Test.io().hasFolder(Route.Test.plug('main', 'src'))).toBe(
            true
        );
    });
    test('setFolder', () => {
        if (
            !Route.Test.io().hasFolder(
                Route.Test.plug('main', '__folder_test__')
            )
        )
            Route.Test.io().setFolder('main', '__folder_test__');
        Route.Test.set(
            '@folder_test',
            Route.Test.plug('main', '__folder_test__')
        );
        Route.Test.io().setFolder('@folder_test', 'files_test_folder');

        const hasFolder = Route.Test.io().hasFolder(
            Route.Test.plug('main', '__folder_test__')
        );
        expect(hasFolder).toBe(true);
    });
    test('folders', () => {
        const folders = Route.Test.io().folders('@folder_test');
        expect(Array.isArray(folders)).toBe(true);
    });

    test('accessFile', async () => {
        const test = await Route.Test.io().accessFile(
            Route.Test.plug('src', 'index.ts')
        );
        expect(test).toBe(true);
    });
});

describe('files', () => {
    test('list', () => {
        const files_list = Route.Test.io().files({ routeName: 'src' });
        expect(files_list.length).toBe(2);
    });

    test('lastFile', () => {
        const lastFiles = Route.Test.io().lastFiles({
            routeName: '__tests__',
            extension: 'ts',
        });
        expect(lastFiles[0].name).toBe('files.test');
    });
});
