
import Application from '../src/App/Application';
import ServiceProvider from '../src/App/ServiceProvider';

beforeEach(() => {
    jest.resetModules();
});

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

describe('automated application test', () => {

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

    test('instance() registers a pre-built object as singleton', () => {
        const app = new TestApp();
        const obj = new Subject();

        app.instance('lorem', obj);

        expect(app.make('lorem')).toBe(obj);
        expect(app.make('lorem')).toBe(obj);
    });

    test('make() throws for an unbound service', () => {
        const app = new TestApp();

        expect(() => app.make('nonexistent')).toThrow("Service 'nonexistent' is not bound");
    });

    test('has() returns true for a bound service', () => {
        const app = new TestApp();
        app.bind('lorem', () => new Subject());

        expect(app.has('lorem')).toBe(true);
    });

    test('has() returns true for a singleton', () => {
        const app = new TestApp();
        app.singleton('lorem', () => new Subject());

        expect(app.has('lorem')).toBe(true);
    });

    test('has() returns true for an instance', () => {
        const app = new TestApp();
        app.instance('lorem', new Subject());

        expect(app.has('lorem')).toBe(true);
    });

    test('has() returns false for an unregistered name', () => {
        const app = new TestApp();

        expect(app.has('nonexistent')).toBe(false);
    });

    test('has() returns false after flush()', () => {
        const app = new TestApp();
        app.bind('lorem', () => new Subject());
        app.create();
        app.flush();

        expect(app.has('lorem')).toBe(false);
    });

    test('create() called twice does not re-run providers', () => {
        const registerFn = jest.fn();

        class OnceProvider extends ServiceProvider {
            register() {
                registerFn();
                this.app.bind('guard-svc', () => new Subject());
            }
        }

        const app = new TestApp();
        app.withProviders([ OnceProvider ]);

        app.create();
        app.create();

        expect(registerFn).toHaveBeenCalledTimes(1);
    });

    test('register() always runs before boot()', () => {
        const order: string[] = [];

        class OrderedProvider extends ServiceProvider {
            register() { order.push('register'); }
            boot()     { order.push('boot'); }
        }

        const app = new TestApp();
        app.withProviders([ OrderedProvider, OrderedProvider ]);
        app.create();

        expect(order).toEqual(['register', 'register', 'boot', 'boot']);
    });

    test('flush() resets configuration and services', () => {
        const app = new TestApp();
        app.withConfiguration({ env: 'test' });
        app.singleton('svc', () => new Subject());
        app.create();
        app.flush();

        expect(app.configuration).toEqual({});
        expect(() => app.make('svc')).toThrow();
    });

});