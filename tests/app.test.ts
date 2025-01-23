
import Application from '../src/App/Application';
import ServiceProvider from '../src/App/ServiceProvider';

class Subject {}

class TestProvider extends ServiceProvider {

    boot() { }

    register() { }

    flush() { }
    
}

class AnotherTestProvider extends ServiceProvider {

    boot() { }

    register() { }

    flush() { }
    
}

class TestApp extends Application {

    foo() {
        return 1;
    }

    bar() {
        return 2;
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

    test('app with multi-instance', async () => {
        const app = new TestApp();

        app.create();

        app.bind('lorem', () => new Subject());

        const a = app.make('lorem');
        const b = app.make('lorem');

        expect(a).not.toBe(b);
    });

    test('app with single-instance', async () => {
        const app = new TestApp();

        app.create();

        app.singleton('lorem', () => new Subject());

        const a = app.make('lorem');
        const b = app.make('lorem');

        expect(a).toBe(b);
    });

    test('flush app', async () => {
        const app = new TestApp();

        app.create();

        const callback = jest.fn();
        app.on('flushed', callback);

        app.flush();

        expect(callback).toHaveBeenCalledTimes(1);
    });

    test('create app validate providers boot method', async () => {
        const app = new TestApp();

        app.withProviders([ TestProvider, AnotherTestProvider ]);

        const a = jest.spyOn(TestProvider.prototype, 'boot');
        const b = jest.spyOn(AnotherTestProvider.prototype, 'boot');

        app.create();

        expect(a).toHaveBeenCalledTimes(1);
        expect(b).toHaveBeenCalledTimes(1);
    });

    test('create app validate providers register method', async () => {
        const app = new TestApp();

        app.withProviders([ TestProvider, AnotherTestProvider ]);
        
        const a = jest.spyOn(TestProvider.prototype, 'register');
        const b = jest.spyOn(AnotherTestProvider.prototype, 'register');

        app.create();

        expect(a).toHaveBeenCalledTimes(1);
        expect(b).toHaveBeenCalledTimes(1);
    });

    test('create app validate providers flush method', async () => {
        const app = new TestApp();

        app.withProviders([ TestProvider, AnotherTestProvider ]);
        
        const a = jest.spyOn(TestProvider.prototype, 'flush');
        const b = jest.spyOn(AnotherTestProvider.prototype, 'flush');

        app.create();
        app.flush();

        expect(a).toHaveBeenCalledTimes(1);
        expect(b).toHaveBeenCalledTimes(1);
    });

});