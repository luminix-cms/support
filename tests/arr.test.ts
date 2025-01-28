
import Arr from '../src/Arr';

beforeEach(() => {
    jest.resetModules();
});

describe('automated array test', () => {

    const array = [
        { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 },
        { name: 'iPhone 5', brand: 'Apple', type: 'phone', released: 2012 },
        { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
        { name: 'Galaxy S6', brand: 'Samsung', type: 'phone', released: 2015 },
        { name: 'Galaxy Gear', brand: 'Samsung', type: 'watch', released: 2013 },
    ];

    /* * * * */

    /**
     * @toReview
     */
    test.skip('calculate cartesian product of given arrays', async () => {

        const array_1 = [ 'x', 'y', 'z' ];
        const array_2 = [ 1, 2, 3 ];

        const arr = Arr.cartesian([ array_1, array_2 ]);

        expect(arr).toEqual([
            [ 'x', 1 ], [ 'x', 2 ], [ 'x', 3 ],
            [ 'y', 1 ], [ 'y', 2 ], [ 'y', 3 ],
            [ 'z', 1 ], [ 'z', 2 ], [ 'z', 3 ],
        ]);
    });

    /**
     * @toReview
     */
    test.skip('gets an array of random elements', async () => {
        const arr = Arr.sampleSize(array, 2);

        expect(arr).toEqual([
            { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 },
            { name: 'iPhone 5', brand: 'Apple', type: 'phone', released: 2012 },
            { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
            { name: 'Galaxy S6', brand: 'Samsung', type: 'phone', released: 2015 },
            { name: 'Galaxy Gear', brand: 'Samsung', type: 'watch', released: 2013 },
        ]);
    });

    /**
     * @toReview
     */
    test.skip('returns a shuffled copy of the array', async () => {
        const arr = Arr.shuffle(array);

        expect(arr).toContain([
            { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 },
            { name: 'iPhone 5', brand: 'Apple', type: 'phone', released: 2012 },
            { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
            { name: 'Galaxy S6', brand: 'Samsung', type: 'phone', released: 2015 },
            { name: 'Galaxy Gear', brand: 'Samsung', type: 'watch', released: 2013 },
        ]);
    });

});
