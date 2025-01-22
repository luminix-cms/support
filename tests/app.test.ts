
import Application from '../src/App/Application';
import ServiceProvider from '../src/App/ServiceProvider';

// import Macroable from '../src/Mixins/Macroable';
// import Reducible from '../src/Mixins/Reducible';

// import mockAxios from 'axios';

class TestProvider extends ServiceProvider {

}

class TestApp extends Application {

    foo() {
        return this.bar();
    }

    bar() {
        return 1;
    }

}

describe('testing application', () => {

    test('create app events', async () => {
        const app = new TestApp();

        const callback = jest.fn();
        app.on('init', callback);
        app.on('booting', callback);
        app.on('booted', callback);
        app.on('ready', callback);

        app.create();

        expect(callback).toHaveBeenCalledTimes(4);
    });

    test('create app with providers', async () => {
        const app = new TestApp();

        app.withProviders([ TestProvider ]);
        app.create();

        expect(app.dump(true).providers.length).toBe(1);
    });

    test('create app without providers', async () => {
        const app = new TestApp();

        app.create();

        expect(app.dump(true).providers.length).toBe(0);
    });

    test('create app with custom configuration', async () => {
        const app = new TestApp();

        app.withConfiguration({
            name: 'Test App',
            env: 'testing',
        });
        app.create();

        expect(app.dump(true).configuration).toContain({
            name: 'Test App',
            env: 'testing',
        });
    });

    // test('create reducible app', async () => {
    //     const app = new (Reducible(TestApp))();

    //     app.reduce('bar', (value: number) => value + 1);

    //     app.create();
    // });

    // test('create macroable app', async () => {
    //     const app = new (Macroable(TestApp))();

    //     app.macro('baz', () => app.foo());

    //     app.create();
    // });

    test('app with single-instance facade', async () => {
        const app = new TestApp();

        app.singleton('lorem', () => 'ipsum');

        const a = app.make('lorem');
        const b = app.make('lorem');

        app.create();

        expect(a).toBe('ipsum');
        expect(b).toBe('ipsum');
        expect(a).toEqual(b);
    });

    test('app with multi-instance facade', async () => {
        const app = new TestApp();

        app.bind('lorem', () => 'ipsum');

        const a = app.make('lorem');
        const b = app.make('lorem');

        app.create();

        expect(a).toContain('ipsum');
        expect(b).toContain('ipsum');
        expect(a).not.toEqual(b);
    });

    test('flush app', async () => {
        const app = new TestApp();

        app.create();

        const callback = jest.fn();
        app.on('flushed', callback);

        app.flush();

        expect(callback).toHaveBeenCalledTimes(1);
    });

});