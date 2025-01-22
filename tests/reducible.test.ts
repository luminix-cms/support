
import Reducible from '../src/Mixins/Reducible';

class TestReducedClass {

    foo() {
        return this.bar();
    }

    bar() {
        return 1;
    }

}

describe('testing reducible class', () => {

    test('create class and validate reduced function', async () => {
        const testClass = new (Reducible(TestReducedClass))();

        testClass.reducer('baz', (value: number) => value + testClass.foo());

        expect(testClass.baz(1)).toBe(2);
    });

    test('create class and check for reduced function', async () => {
        const testClass = new (Reducible(TestReducedClass))();

        testClass.reducer('baz', jest.fn());

        expect(testClass.hasReducer('baz')).toBe(true);
    });

    test('create class and flush especific reduced function', async () => {
        const testClass = new (Reducible(TestReducedClass))();

        testClass.reducer('narf_1', jest.fn());
        testClass.reducer('narf_2', jest.fn());
        testClass.reducer('narf_3', jest.fn());
        
        testClass.removeReducer('narf_2', jest.fn());

        expect(testClass.hasReducer('narf_2')).toBe(false);
    });

    test('create class and clear especific reduced function', async () => {
        const testClass = new (Reducible(TestReducedClass))();

        testClass.reducer('narf_1', jest.fn());
        testClass.reducer('narf_2', jest.fn());
        testClass.reducer('narf_3', jest.fn());
        
        testClass.clearReducer('narf_2');

        expect(testClass.getReducer('narf_2').count()).toBe(0);
    });

    test('create class and flush all reduced functions', async () => {
        const testClass = new (Reducible(TestReducedClass))();

        testClass.reducer('baz', jest.fn());
        
        testClass.flushReducers();

        Object.keys(testClass._reducers).forEach((key) => {
            const reducer = testClass.getReducer(key);
            
            expect(reducer.count()).toBe(0);
        });
    });
    
});