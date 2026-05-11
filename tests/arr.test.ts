
import Arr from '../src/Arr';

beforeEach(() => {
    jest.resetModules();
});

describe('automated array test', () => {

    const items = [
        { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 },
        { name: 'iPhone 5', brand: 'Apple', type: 'phone', released: 2012 },
        { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
        { name: 'Galaxy S6', brand: 'Samsung', type: 'phone', released: 2015 },
        { name: 'Galaxy Gear', brand: 'Samsung', type: 'watch', released: 2013 },
    ];

    test('calculate cartesian product of given arrays', () => {
        const result = Arr.cartesian<string | number>(['x', 'y', 'z'], [1, 2, 3]);

        expect(result).toEqual([
            ['x', 1], ['x', 2], ['x', 3],
            ['y', 1], ['y', 2], ['y', 3],
            ['z', 1], ['z', 2], ['z', 3],
        ]);
    });

    test('cartesian product of a single array returns its elements wrapped', () => {
        const result = Arr.cartesian([1, 2, 3]);

        expect(result).toEqual([1, 2, 3]);
    });

    test('gets an array of n random elements from the source', () => {
        const result = Arr.sampleSize(items, 2);

        expect(result).toHaveLength(2);
        result.forEach((item) => expect(items).toContain(item));
    });

    test('sampleSize does not modify the original array', () => {
        const original = [1, 2, 3, 4, 5];
        Arr.sampleSize(original, 3);

        expect(original).toEqual([1, 2, 3, 4, 5]);
    });

    test('returns a shuffled copy that contains the same elements', () => {
        const original = [1, 2, 3, 4, 5];
        const result = Arr.shuffle(original);

        expect(result).toHaveLength(original.length);
        expect(result).toEqual(expect.arrayContaining(original));
        expect(original).toEqual(expect.arrayContaining(result));
    });

    test('shuffle does not modify the original array', () => {
        const original = [1, 2, 3, 4, 5];
        Arr.shuffle(original);

        expect(original).toEqual([1, 2, 3, 4, 5]);
    });

});
