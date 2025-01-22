
import Application from '../src/App/Application';
import ServiceProvider from '../src/App/ServiceProvider';

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

describe('testing application class', () => {

    const testConfig = {
        name: 'Test App',
        env: 'testing',
    };

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

        expect(app.dump(true).configuration).toStrictEqual(testConfig);
    });

    test('app with multi-instance facade', async () => {
        const app = new TestApp();

        app.create();

        app.bind('lorem', () => 'ipsum');

        const a = app.make('lorem');
        const b = app.make('lorem');

        expect(a).not.toEqual(b);
    });

    test('app with single-instance facade', async () => {
        const app = new TestApp();

        app.create();

        app.singleton('lorem', () => 'ipsum');

        const a = app.make('lorem');
        const b = app.make('lorem');

        expect(a).toEqual(b);
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