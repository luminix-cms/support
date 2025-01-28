
import Func from '../src/Func';

beforeEach(() => {
    jest.resetModules();
});

describe('automated function test', () => {

    const test_function = async (x: number) => Math.pow((x + 1), 2);

    test('await throttled function', async () => {
        const throttled = jest.fn(Func.throttle(test_function, 1000));

        const result = await throttled(1);

        expect(result).toEqual(4);
        expect(throttled).toHaveBeenCalledTimes(1);
    });

    /**
     * @toReview
     */
    test.skip('await debounced function', async () => {
        const debounced = jest.fn(Func.debounce(test_function, 1000));

        const result = await debounced(1);

        await new Promise(resolve => setTimeout(resolve, 1000));
        await new Promise(resolve => setTimeout(resolve, 1000));
        await new Promise(resolve => setTimeout(resolve, 1000));

        expect(result).toEqual(4);
        expect(debounced).toHaveBeenCalledTimes(1);
    });

});
