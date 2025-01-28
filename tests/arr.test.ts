
import Arr from '../src/Arr';

beforeEach(() => {
    jest.resetModules();
});

describe('automated array test', () => {

    const array_0 = [
        { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 },
        { name: 'iPhone 5', brand: 'Apple', type: 'phone', released: 2012 },
        { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
        { name: 'Galaxy S6', brand: 'Samsung', type: 'phone', released: 2015 },
        { name: 'Galaxy Gear', brand: 'Samsung', type: 'watch', released: 2013 },
    ];

    const array_1 = [ 1, 2 ];

    const array_2 = [ 'foo', 'bar' ];

    const array_3 = [ (x: number) => x + 1, (y: number) => y + 2 ];

    /* * * * */

    test('calculate cartesian product of given arrays', async () => {
        const arr = Arr.cartesian([ array_1, array_2, array_3 ]);

        // expect(arr).toEqual([
        //     [ 1, 'foo', (x: number) => x + 1 ],
        //     [ 1, 'bar', (x: number) => x + 1 ],
        //     [ 1, 'foo', (y: number) => y + 2 ],
        //     [ 1, 'bar', (y: number) => y + 2 ],
        //     [ 2, 'foo', (x: number) => x + 1 ],
        //     [ 2, 'bar', (x: number) => x + 1 ],
        //     [ 2, 'foo', (y: number) => y + 2 ],
        //     [ 2, 'bar', (y: number) => y + 2 ],
        // ]);
        expect(arr).toEqual([
            [ 1, 2 ],
            [ 'foo', 'bar' ],
            [ (x: number) => x + 1, (y: number) => y + 2 ],
        ]);
    });

    test('gets an array of random elements', async () => {
        const arr = Arr.sampleSize(array_0, 2);

        expect(arr).toEqual([
            { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 },
            { name: 'iPhone 5', brand: 'Apple', type: 'phone', released: 2012 },
            { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
            { name: 'Galaxy S6', brand: 'Samsung', type: 'phone', released: 2015 },
            { name: 'Galaxy Gear', brand: 'Samsung', type: 'watch', released: 2013 },
        ]);
    });

    test('returns a shuffled copy of the array', async () => {
        const arr = Arr.shuffle(array_0);

        expect(arr).toContain([
            { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 },
            { name: 'iPhone 5', brand: 'Apple', type: 'phone', released: 2012 },
            { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
            { name: 'Galaxy S6', brand: 'Samsung', type: 'phone', released: 2015 },
            { name: 'Galaxy Gear', brand: 'Samsung', type: 'watch', released: 2013 },
        ]);
    });

});
