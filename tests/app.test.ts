
import Application from '../src/App/Application';
import ServiceProvider from '../src/App/ServiceProvider';

// import mockAxios from 'axios';

describe('testing application', () => {

    test('app create with providers', async () => {
        const app = new Application();

        app.withProviders([ ServiceProvider ]);
        app.create();

        // expect(app.providers().length).toBe(1);
        expect(app.on('ready', () => true)).toBe(true);
    });

    test('app create without providers', async () => {
        const app = new Application();

        app.create();

        // expect(app.providers().length).toBe(0);
        expect(app.on('ready', () => true)).toBe(true);
    });

    test('app create with custom configuration', async () => {
        const app = new Application();

        app.withConfiguration({
            name: 'Test App',
            env: 'testing',
        });
        app.create();

        // expect(app.configurations()).toContain({
        //     name: 'Test App',
        //     env: 'testing',
        // });
        expect(app.on('ready', () => true)).toBe(true);
    });

    test('app with single-instance facade', async () => {
        const app = new Application();

        app.singleton('foo', () => 'bar');

        const a = app.make('foo');
        const b = app.make('foo');

        app.create();

        expect(a).toBe('bar');
        expect(b).toBe('bar');
        expect(a).toEqual(b);
    });

    test('app with multi-instance facade', async () => {
        const app = new Application();

        app.bind('foo', () => 'bar');

        const a = app.make('foo');
        const b = app.make('foo');

        app.create();

        expect(a).toBe('bar');
        expect(b).toBe('bar');
        expect(a).not.toEqual(b);
    });

    test('app flush', async () => {
        const app = new Application();

        app.create();
        app.flush();

        expect(app.on('flushed', () => true)).toBe(true);
    });

});