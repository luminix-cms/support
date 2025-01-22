
import Application from '../src/App/Application';

import MakeFacade, { HasFacadeAccessor } from '../src/Mixins/MakeFacade';

class TestApp extends Application {

    foo() {
        return this.bar();
    }

    bar() {
        return 1;
    }

}

class TestFacadeClass implements HasFacadeAccessor {

    getFacadeAccessor(): string {
        return 'testFacade';
    }

}

describe('testing class with facade', () => {

    test('create class, add facade accessor and retrieve function result', async () => {
        const testApp = new TestApp();
        const testClass = MakeFacade(TestFacadeClass, testApp);

        const accessor = testClass.getFacadeAccessor() as string;

        testApp.bind(accessor, () => testApp.foo() + 1);

        const result = testApp.make(accessor);
        
        expect(result).toBe(2);
    });

});