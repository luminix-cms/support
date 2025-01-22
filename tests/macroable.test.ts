
import Macroable from '../src/Mixins/Macroable';

class TestMacroedClass {

    foo() {
        return this.bar();
    }

    bar() {
        return 1;
    }

}

describe('testing macroable class', () => {

    test('create class and make a macro function', async () => {
        const testClass = new (Macroable(TestMacroedClass));

        testClass.macro('baz', () => testClass.foo());

        expect(testClass.baz()).toBe(1);
    });

    test('create class and check for macro function', async () => {
        const testClass = new (Macroable(TestMacroedClass));

        testClass.macro('baz', () => testClass.foo());

        expect(testClass.hasMacro('baz')).toBe(true);
    });

    test('create class and flush macro function', async () => {
        const testClass = new (Macroable(TestMacroedClass))();

        testClass.macro('baz', () => testClass.foo());
        
        testClass.flushMacros();

        expect(Object.keys(testClass._macros).length).toBe(0);
    });
    
});
