import { Route } from './_routes';

describe('folder', () => {
    test('hasFolder', () => {
        expect(Route.Test.io().hasFolder('main', 'src')).toBe(true);
    });
    test('setFolder', () => {
        if (!Route.Test.io().hasFolder('main', '__folder__test'))
            Route.Test.io().setFolder('main', '__folder_test__');
        Route.Test.set(
            '@folder_test',
            Route.Test.plug('main', '__folder_test__')
        );
        Route.Test.io().setFolder('@folder_test', 'files_test_folder');

        expect(Route.Test.io().hasFolder('@folder_test', 'files_test_folder'));
    });
    test('folders', () => {
        const folders = Route.Test.io().folders('@folder_test');
        expect(Array.isArray(folders)).toBe(true);
    });
});
