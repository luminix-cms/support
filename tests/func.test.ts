
import Func from '../src/Func';

beforeEach(() => {
    jest.resetModules();
});

describe('automated function test', () => {

    const square = (x: number) => Math.pow(x + 1, 2);

    // --- throttle ---

    test('throttle executes the function and returns its value', async () => {
        const throttled = Func.throttle(square, 1000);

        const result = throttled(1);

        expect(result).toEqual(4);
    });

    test('throttle suppresses calls within the wait window', () => {
        jest.useFakeTimers();
        const fn = jest.fn(square);
        const throttled = Func.throttle(fn, 500);

        throttled(1);
        throttled(1);
        throttled(1);

        expect(fn).toHaveBeenCalledTimes(1);
        jest.useRealTimers();
    });

    // --- debounce ---

    test('debounce delays execution until after the wait period', () => {
        jest.useFakeTimers();
        const fn = jest.fn(square);
        const debounced = Func.debounce(fn, 500);

        debounced(1);
        expect(fn).not.toHaveBeenCalled();

        jest.advanceTimersByTime(500);
        expect(fn).toHaveBeenCalledTimes(1);

        jest.useRealTimers();
    });

    test('debounce only fires once for rapid successive calls', () => {
        jest.useFakeTimers();
        const fn = jest.fn(square);
        const debounced = Func.debounce(fn, 500);

        debounced(1);
        debounced(1);
        debounced(1);

        jest.advanceTimersByTime(500);
        expect(fn).toHaveBeenCalledTimes(1);

        jest.useRealTimers();
    });

    test('debounce.cancel() prevents the pending invocation', () => {
        jest.useFakeTimers();
        const fn = jest.fn(square);
        const debounced = Func.debounce(fn, 500);

        debounced(1);
        debounced.cancel();

        jest.advanceTimersByTime(600);
        expect(fn).not.toHaveBeenCalled();

        jest.useRealTimers();
    });

    test('debounce.flush() executes the pending call immediately', () => {
        jest.useFakeTimers();
        const fn = jest.fn(square);
        const debounced = Func.debounce(fn, 500);

        debounced(1);
        debounced.flush();

        expect(fn).toHaveBeenCalledTimes(1);

        jest.useRealTimers();
    });

});
