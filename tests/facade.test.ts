
import Application from '../src/App/Application';
import ServiceProvider from '../src/App/ServiceProvider';

import MakeFacade, { HasFacadeAccessor } from '../src/Mixins/MakeFacade';

beforeEach(() => {
    jest.resetModules();
});

class TestFacadeClass implements HasFacadeAccessor {

    getFacadeAccessor(): string {
        return 'test';
    }

}

class TestServiceProvider extends ServiceProvider {
    
    register() {
        this.app.bind('test', () => new TestService());
    }
}

class TestService {

    foo() {
        return 1;
    }

    bar() {
        return 2;
    }

}

class StatefulService {

    callback: (() => void) | null = null;

    setCallback(callback: () => void): void {
        this.callback = callback;
    }

    getCallback(): (() => void) | null {
        return this.callback;
    }

    withCallback(callback: () => void): this {
        this.callback = callback;
        return this;
    }

}

class StatefulFacadeClass implements HasFacadeAccessor {

    getFacadeAccessor(): string {
        return 'stateful';
    }

}

class StatefulServiceProvider extends ServiceProvider {

    register() {
        this.app.singleton('stateful', () => new StatefulService());
    }
}

type AppContainers = { 'test': TestService, 'stateful': StatefulService };

// Mirrors the `App` facade in @luminix/core: the accessor is the application
// object itself, and `down`/`setInstance` exist only on the facade.
class AppLikeFacadeClass implements HasFacadeAccessor {

    protected app?: Application<AppContainers>;

    getFacadeAccessor(): string | object {
        if (!this.app) {
            this.app = new Application<AppContainers>([StatefulServiceProvider]);
        }

        return this.app;
    }

    down() {
        if (this.app) {
            this.app.flush();
            delete this.app;
        }
    }

}

describe('automated facade test', () => {

    test('create app, make facade and retrieve function result', async () => {
        const testApp = new Application<AppContainers>([ TestServiceProvider ]);
        const Test = MakeFacade<TestService, TestFacadeClass>(TestFacadeClass, testApp);

        testApp.create();

        expect(Test.foo()).toBe(1);
        expect(Test.bar()).toBe(2);
    });

    test('methods called through the facade bind `this` to the service', () => {
        const testApp = new Application<AppContainers>([ StatefulServiceProvider ]);
        const Stateful = MakeFacade<StatefulService, StatefulFacadeClass>(StatefulFacadeClass, testApp);

        testApp.create();

        const custom = jest.fn();
        Stateful.setCallback(custom);

        // State set through the facade must land on the service instance,
        // so consumers resolving the service directly from the container
        // observe the same state.
        const service = testApp.make('stateful');
        expect(service.callback).toBe(custom);
        expect(service.getCallback()).toBe(custom);

        // The facade itself must not accumulate service state.
        expect(Object.getOwnPropertyNames(Stateful)).not.toContain('callback');
    });

    test('state written through the facade is readable through the facade', () => {
        const testApp = new Application<AppContainers>([ StatefulServiceProvider ]);
        const Stateful = MakeFacade<StatefulService, StatefulFacadeClass>(StatefulFacadeClass, testApp);

        testApp.create();

        const custom = jest.fn();
        Stateful.setCallback(custom);

        expect(Stateful.getCallback()).toBe(custom);
        expect(Stateful.callback).toBe(custom);
    });

    test('fluent service methods keep the chain on the facade', () => {
        const testApp = new Application<AppContainers>([ StatefulServiceProvider ]);
        const Stateful = MakeFacade<StatefulService, StatefulFacadeClass>(StatefulFacadeClass, testApp);

        testApp.create();

        const custom = jest.fn();
        const result = Stateful.withCallback(custom);

        // `return this` inside the service must resolve to the facade when
        // called through it, so facade-only members stay reachable in chains.
        expect(result).toBe(Stateful);

        // ...while the state still lands on the service instance.
        expect(testApp.make('stateful').callback).toBe(custom);
    });

    test('object-accessor facade keeps facade-only methods reachable after fluent calls', () => {
        const AppLike = MakeFacade<Application<AppContainers>, AppLikeFacadeClass>(AppLikeFacadeClass);

        // Simulates @luminix/react LuminixProvider under React dev/StrictMode:
        // the effect runs, is cleaned up (`down`), then runs again.
        const app1 = AppLike.withProviders([]);

        expect(app1).toBe(AppLike);

        app1.create();

        expect(app1.has('stateful')).toBe(true);

        expect(() => app1.down()).not.toThrow();

        const app2 = AppLike.withProviders([]);

        app2.create();

        // A fresh application was created after `down()`.
        expect(app2.has('stateful')).toBe(true);
        expect(app2.make('stateful').callback).toBeNull();
    });

});
