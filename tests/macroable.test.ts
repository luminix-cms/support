
import Macroable from '../src/Mixins/Macroable';

beforeEach(() => {
    jest.resetModules();
});

class TestMacroedClass {

    foo() {
        return 'foo';
    }

    bar() {
        return 'bar';
    }

}

describe('automated macroable test', () => {

    test('create class and make a macro function', async () => {
        const testClass = new (Macroable(TestMacroedClass));

        testClass.macro('baz', () => 'baz');

        // metodos originais continuam funcionando
        expect(testClass.foo()).toBe('foo');
        expect(testClass.bar()).toBe('bar');

        // metodo macro criado funcional
        expect(testClass.baz()).toBe('baz');
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
        expect(() => testClass.baz()).toThrow('testClass.baz is not a function');

    });
    
});
