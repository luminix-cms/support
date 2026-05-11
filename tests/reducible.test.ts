
import Reducible from '../src/Mixins/Reducible';

class TestReducedClass {

    foo() {
        return 1;
    }

    bar() {
        return 2;
    }

}

describe('automated reducible tests', () => {

    test('check if function is called in reduced function', async () => {
        const testClass = new (Reducible(TestReducedClass))();

        const bar = jest.fn().mockReturnValue(2);

        testClass.reducer('baz', (value: number) => value + bar());

        testClass.baz(1);

        expect(bar).toHaveBeenCalledTimes(1);
        expect(testClass.baz(1)).toBe(3);
    });

    test('create class and check for reduced function', async () => {
        const testClass = new (Reducible(TestReducedClass))();

        testClass.reducer('baz', jest.fn());

        expect(testClass.hasReducer('baz')).toBe(true);
    });

    test('create class and flush especific reduced function', async () => {
        const testClass = new (Reducible(TestReducedClass))();

        const narf_2 = jest.fn();

        testClass.reducer('narf_1', jest.fn());
        testClass.reducer('narf_2', narf_2);
        testClass.reducer('narf_3', jest.fn());
        
        testClass.removeReducer('narf_2', narf_2);

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

        expect(testClass.baz(1)).toBe(1);
    });

    test('reducers run in ascending priority order', () => {
        const order: number[] = [];
        const testClass = new (Reducible(TestReducedClass))();

        testClass.reducer('pipe', (v: number) => { order.push(30); return v; }, 30);
        testClass.reducer('pipe', (v: number) => { order.push(10); return v; }, 10);
        testClass.reducer('pipe', (v: number) => { order.push(20); return v; }, 20);

        testClass.pipe(0);

        expect(order).toEqual([10, 20, 30]);
    });

    test('reducer() returns an unsubscribe function that removes it', () => {
        const fn = jest.fn((v: number) => v + 1);
        const testClass = new (Reducible(TestReducedClass))();

        const off = testClass.reducer('add', fn);

        expect(testClass.add(0)).toBe(1);

        off();

        expect(testClass.add(0)).toBe(0);
        expect(testClass.hasReducer('add')).toBe(false);
    });

    test('multiple reducers compose their transformations in sequence', () => {
        const testClass = new (Reducible(TestReducedClass))();

        testClass.reducer('transform', (v: number) => v + 1, 10);
        testClass.reducer('transform', (v: number) => v * 2, 20);

        expect(testClass.transform(3)).toBe(8);
    });

    test('reducer() throws ReducerOverrideException when name collides with an existing method', () => {
        const testClass = new (Reducible(TestReducedClass))();

        expect(() => testClass.reducer('foo', jest.fn())).toThrow();
    });

});