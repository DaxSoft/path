import { Route } from './_routes';

const TOKEN: string = Date.now().toString(16);

describe('routes', () => {
    test('has', () => expect(Route.Test.has('main')).toBe(true));
    test('get', () => expect(Route.Test.get('src').name).toBe('src'));
    test('alias', () => {
        expect(Route.Test.endWith(Route.Test.get('developer').filepath)).toBe(
            Route.Test.endWith(Route.Test.get('src').filepath)
        );
    });
    test('remove', () => {
        Route.Test.remove('developer');
        expect(Route.Test.has('developer')).toBe(false);
    });
    test('join', () => {
        Route.Test.join('coverage', 'main');
        expect(Route.Test.has('coverage')).toBe(true);
    });
    test('inject', () => {
        Route.Test.inject('@folder_test', 'main', '__folder_test__');
        expect(
            Route.Test.endWith(Route.Test.get('@folder_test').filepath)
        ).toBe('__folder_test__');
    });
    test('plug', () => {
        expect(
            Route.Test.endWith(Route.Test.plug('main', 'package.json'))
        ).toBe('package.json');
    });
});

describe('methods', () => {
    test('back', () => {
        const getBackToSrc = Route.Test.back('__tests__', 1);
        expect(Route.Test.endWith(getBackToSrc)).toBe('src');
    });

    test('setItem', () => {
        Route.Test.setItem('token', TOKEN);
        expect(Route.Test.hasItem('token')).toBe(true);
    });

    test('getItem', () => expect(Route.Test.getItem('token')).toEqual(TOKEN));
});
