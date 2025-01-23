
import Application from '../src/App/Application';
import ServiceProvider from '../src/App/ServiceProvider';

import MakeFacade, { HasFacadeAccessor } from '../src/Mixins/MakeFacade';

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

type AppContainers = { 'test': TestService };

describe('testing class with facade', () => {

    test('create class, add facade accessor and retrieve function result', async () => {
        const testApp = new Application<AppContainers>([ TestServiceProvider ]);
        const Test = MakeFacade<TestService, TestFacadeClass>(TestFacadeClass, testApp);

        testApp.create();
        
        expect(Test.foo()).toBe(1);
        expect(Test.bar()).toBe(2);
    });

});
