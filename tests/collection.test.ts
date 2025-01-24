
import Collection from '../src/Collection';

export default function collect<T = unknown>(items: T[]) {
    return new Collection(items);
}

describe('automated collection test', () => {

    const obj_collection_1 = collect([
        { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 },
        { name: 'iPhone 5', brand: 'Apple', type: 'phone', released: 2012 },
        { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
        { name: 'Galaxy S6', brand: 'Samsung', type: 'phone', released: 2015 },
        { name: 'Galaxy Gear', brand: 'Samsung', type: 'watch', released: 2013 },
    ]) as Collection<unknown>;

    const obj_collection_2 = collect([
        { name: 'iPhone 10', brand: 'Apple', type: 'phone', released: 2018 },
        { name: 'iPhone 9', brand: 'Apple', type: 'phone', released: 2017 },
        { name: 'iPhone 8', brand: 'Apple', type: 'phone', released: 2016 },
    ]) as Collection<unknown>;

    const obj_collection_3 = collect([
        { name: 'iPhone 14', brand: 'Apple', type: 'phone', released: 2022 },
    ]) as Collection<unknown>;

    // const obj_collection_4 = collect([
    //     { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 },
    //     { name: 'iPhone 5', brand: 'Apple', type: 'phone', released: 2012 },
    //     { name: 'iPhone 9', brand: 'Apple', type: 'phone', released: 2017 },
    //     { name: 'iPhone 14', brand: 'Apple', type: 'phone', released: 2022 },
    //     { name: 'iPhone 15', brand: 'Apple', type: 'phone', released: 2023 },
    //     { name: 'iPhone 16', brand: 'Apple', type: 'phone', released: 2025 },
    // ]) as Collection<unknown>;

    // const obj_collection_5 = collect([
    //     { company: { name: 'Apple', released: 1987 } },
    //     { company: { name: 'Apple', released: 1987 } },
    //     { company: { name: 'Samsung', released: 1985 } },
    // ]) as Collection<unknown>;

    /* * * * */

    const array_collection = collect([
        [
            { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 },
            { name: 'iPhone 5', brand: 'Apple', type: 'phone', released: 2012 },
        ],
        [
            { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
            { name: 'Galaxy S6', brand: 'Samsung', type: 'phone', released: 2015 },
        ],
        [
            { name: 'Galaxy Gear', brand: 'Samsung', type: 'watch', released: 2013 },
        ]
    ]) as Collection<unknown[]>;

    /* * * * */

    const string_collection_1 = collect([ 'foo', 'bar', 'baz' ]) as Collection<string>;

    const string_collection_2 = collect([ 'lorem', 'ipsum' ]) as Collection<string>;

    const number_collection_1 = collect([ 1, 2.0, 3.3, 4.567, 0.5, 10 ]) as Collection<number>;

    const number_collection_2 = collect([ 10, 20, 20, 30, 30, 30 ]) as Collection<number>;

    const number_collection_3 = collect([ 20, 30, 40 ]) as Collection<number>;

    /* * * * */

    const array_of_number_collection_1 = collect([ 
        [ 1, 2, 3 ], 
        [ 4, 5, 6 ], 
        [ 7, 8, 9 ], 
    ]) as Collection<number[]>;
    
    // const array_of_number_collection_2 = collect([ 
    //     [ 10, 20 ], 
    //     [ 20, 30 ], 
    // ]) as Collection<number[]>;

    // const array_of_number_collection_3 = collect([ [ 1, 2 ], [ 10, 20, 30 ] ]) as Collection<number[]>;

    /* * * * */

    test('retrieve all collection items', async () => {
        const result = obj_collection_1.all();

        expect(result).toStrictEqual([
            { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 },
            { name: 'iPhone 5', brand: 'Apple', type: 'phone', released: 2012 },
            { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
            { name: 'Galaxy S6', brand: 'Samsung', type: 'phone', released: 2015 },
            { name: 'Galaxy Gear', brand: 'Samsung', type: 'watch', released: 2013 },
        ]);
    });

    test('check if collection transform to array', async () => {
        const result = obj_collection_1.toArray();
        
        expect(result).toEqual([
            { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 },
            { name: 'iPhone 5', brand: 'Apple', type: 'phone', released: 2012 },
            { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
            { name: 'Galaxy S6', brand: 'Samsung', type: 'phone', released: 2015 },
            { name: 'Galaxy Gear', brand: 'Samsung', type: 'watch', released: 2013 },
        ]);
    });

    test('retrieve average collection items average count', async () => {
        const result = obj_collection_2.count();
        
        expect(result).toBe(3);
    });

    test('retrieve average collection items average count by', async () => {
        const result = string_collection_1.countBy(() => 'items');
        
        expect(result).toEqual({ items: 3 });
    });

    test('retrieve average collection items average count', async () => {
        const result = number_collection_1.average();

        expect(result).toEqual(3.561166666666667);
    });

    test('retrieve average collection item average count by key', async () => {
        const result = array_of_number_collection_1.average('1' as keyof number[]);

        expect(result).toEqual(5);
    });

    // test('retrieve collection items by chunk', async () => {
    //     const result = obj_collection_1.chunk(2);

    //     expect(result).toEqual(collect([
    //         collect([
    //             { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 },
    //             { name: 'iPhone 5', brand: 'Apple', type: 'phone', released: 2012 },
    //         ]),
    //         collect([
    //             { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
    //             { name: 'Galaxy S6', brand: 'Samsung', type: 'phone', released: 2015 },
    //         ]),
    //         collect([
    //             { name: 'Galaxy Gear', brand: 'Samsung', type: 'watch', released: 2013 },
    //         ])
    //     ]));
    // });

    // test('retrieve collection items by chunk while condition', async () => {
    //     const result = obj_collection_1.chunkWhile((item, index, next) => index < 3);

    //     expect(result).toEqual(collect([
    //         collect([
    //             { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 },
    //             { name: 'iPhone 5', brand: 'Apple', type: 'phone', released: 2012 },
    //         ]),
    //         collect([
    //             { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
    //             { name: 'Galaxy S6', brand: 'Samsung', type: 'phone', released: 2015 },
    //         ]),
    //         collect([
    //             { name: 'Galaxy Gear', brand: 'Samsung', type: 'watch', released: 2013 },
    //         ])
    //     ]));
    // });

    test('retrieve array collection items collapsed', async () => {
        const result = array_collection.collapse();

        expect(result.toArray()).toEqual(([
            { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 },
            { name: 'iPhone 5', brand: 'Apple', type: 'phone', released: 2012 },
            { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
            { name: 'Galaxy S6', brand: 'Samsung', type: 'phone', released: 2015 },
            { name: 'Galaxy Gear', brand: 'Samsung', type: 'watch', released: 2013 },
        ]));
    });

    test('retrieve collection items combined', async () => {
        const result = string_collection_1.combine(string_collection_2);
        
        expect(result).toEqual({
            foo: 'lorem',
            bar: 'ipsum',
            baz: null,
        });
    });

    test('retrieve collection with concatenated collection', async () => {
        const result = obj_collection_1.concat(obj_collection_2);
        
        expect(result.toArray()).toEqual(([
            { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 },
            { name: 'iPhone 5', brand: 'Apple', type: 'phone', released: 2012 },
            { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
            { name: 'Galaxy S6', brand: 'Samsung', type: 'phone', released: 2015 },
            { name: 'Galaxy Gear', brand: 'Samsung', type: 'watch', released: 2013 },
            { name: 'iPhone 10', brand: 'Apple', type: 'phone', released: 2018 },
            { name: 'iPhone 9', brand: 'Apple', type: 'phone', released: 2017 },
            { name: 'iPhone 8', brand: 'Apple', type: 'phone', released: 2016 },
        ]));
    });

    test('retrieve collection with concatenated array', async () => {
        const result = obj_collection_1.concat(obj_collection_2.toArray());
        
        expect(result.toArray()).toEqual(([
            { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 },
            { name: 'iPhone 5', brand: 'Apple', type: 'phone', released: 2012 },
            { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
            { name: 'Galaxy S6', brand: 'Samsung', type: 'phone', released: 2015 },
            { name: 'Galaxy Gear', brand: 'Samsung', type: 'watch', released: 2013 },
            { name: 'iPhone 10', brand: 'Apple', type: 'phone', released: 2018 },
            { name: 'iPhone 9', brand: 'Apple', type: 'phone', released: 2017 },
            { name: 'iPhone 8', brand: 'Apple', type: 'phone', released: 2016 },
        ]));
    });

    test('check if collection contains item', async () => {
        const result = number_collection_1.contains(1);
        
        expect(result).toBe(true);
    });

    test('check if collection contains item by key', async () => {
        const result = obj_collection_3.contains('brand' as never, 'Apple');
        
        expect(result).toBe(true);
    });

    // test('check if collection contains strict item', async () => {
    //     const result = obj_collection_5.containsStrict('name' as never, 'Samsung');
        
    //     expect(result).toBe(true);
    // });

    test('check if collection doesnt contain item', async () => {
        const result = number_collection_1.doesntContain(5);
        
        expect(result).toBe(true);
    });

    test('check if collection doesnt contain item by key', async () => {
        const result = obj_collection_3.doesntContain('brand' as never, 'Samsung');
        
        expect(result).toBe(true);
    });

    test('check if collection has only 1 item', async () => {
        const result = obj_collection_3.containsOneItem();
        
        expect(result).toBe(true);
    });

    // test('retrieve collection with cross join', async () => {
    //     const result = array_of_number_collection_3.crossJoin();

    //     expect(result).toEqual(collect([
    //         [ 1, 10 ], 
    //         [ 1, 20 ], 
    //         [ 1, 30 ],
    //         [ 2, 10 ], 
    //         [ 2, 20 ],
    //         [ 2, 30 ],
    //     ]));
    // });

    test('retrieve collections difference', async () => {
        const result = number_collection_2.diff(number_collection_3);

        expect(result.toArray()).toEqual(([ 10 ]));
    });

    test('retrieve collection duplicated items', async () => {
        const result = number_collection_2.duplicates();

        expect(result.toArray()).toEqual(([ 20, 30, 30 ]));
    });

    test('retrieve collection with duplicated items by key', async () => {
        const result = obj_collection_1.duplicates('brand' as never);
        
        expect(result.toArray()).toEqual(([ 'Apple', 'Apple', 'Samsung' ]));
    });

    // test('retrieve collection strictly duplicated items', async () => {
    //     const result = obj_collection_5.duplicatesStrict('name' as never);

    //     expect(result.toArray()).toEqual(([ 'Apple' ]));
    // });

    test('check collection for each item', async () => {

        const resolve: number[] = [];

        number_collection_3.each((item, index) => {
            item += index * 10;
            resolve.push(item);
            return;
        });

        expect(resolve).toEqual([ 20, 40, 60 ]);
    });

    test('check collection for each spreaded items', async () => {

        const resolve: number[] = [];

        array_of_number_collection_1.eachSpread((...args) => {

            const sum = args.reduce((carry: number, item) => carry + (item as number), 0);
            resolve.push(sum);

            return;
        });

        expect(resolve).toEqual([ 6, 15, 24 ]);
    });

    test('check collection for every item', async () => {
        const result_1 = number_collection_1.every((item, index) => {
            return (item + index) >= 5.5;
        });
        const result_2 = number_collection_1.every((item, index) => {
            return (item + index) > 0;
        });

        expect(result_1).toBe(false);
        expect(result_2).toBe(true);
    });

    test('retrieve collection items except', async () => {
        const result = obj_collection_1.except([ 1, 3 ]);

        expect(result.toArray()).toEqual(([
            { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 },
            { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
            { name: 'Galaxy Gear', brand: 'Samsung', type: 'watch', released: 2013 },
        ]));
    });

    test('retrieve collection items filtered by', async () => {
        const result = obj_collection_1.filter((item, index) => {
            return ((item as Record<string, any>).brand === 'Apple') && (index > 0);
        });

        expect(result.toArray()).toEqual(([
            { name: 'iPhone 5', brand: 'Apple', type: 'phone', released: 2012 },
            { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
        ]));
    });

    test('retrieve collection first item', async () => {
        const result = obj_collection_1.first((item, index) => {
            return ((item as Record<string, any>).brand === 'Apple') && (index > 0);
        });

        expect(result).toEqual({ name: 'iPhone 5', brand: 'Apple', type: 'phone', released: 2012 });
    });

    test('retrieve collection first item where', async () => {
        const result = obj_collection_1.firstWhere('brand' as never, 'Samsung');

        expect(result).toEqual({ name: 'Galaxy S6', brand: 'Samsung', type: 'phone', released: 2015 });
    });

    // test('retrieve collection first or fail item', async () => {
    //     const result = obj_collection_1.firstOrFail((item) => {
    //         return (item as Record<string, any>).brand === 'Motorola';
    //     });

    //     expect(result).toThrow('No matching item found');
    // });

    test('check collection item type', async () => {
        const result = number_collection_1.ensure('number');

        expect(result).toEqual(number_collection_1);
    });

    /* * * * */

    // test('retrieve collection dump', async () => {
    //     const result = obj_collection_1.dump();

    //     expect(result).toEqual(console.log(obj_collection_1.toArray()));
    // });

});