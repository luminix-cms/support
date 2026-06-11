
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

});
