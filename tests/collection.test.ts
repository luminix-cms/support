
import Collection from '../src/Collection';

beforeEach(() => {
    jest.resetModules();
});

export default function collect<T = unknown>(items: T[]) {
    return new Collection(items);
}

class TestClass {

    #foos: string[] = [];

    constructor(item: any) {
        this.foo(item);
    }

    get foos() {
        return this.#foos;
    }

    public foo(item: any) {
        this.#foos.push(item);
    }

}

class Foo {}

class Bar {}

class Baz {}

describe('automated collection test', () => {

    const empty_collection = collect([]);

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

    const obj_collection_4 = collect([
        { name: 'iPhone 10', brand: 'Apple', type: 'phone', released: 2018, weight: 0.75 },
        { name: 'iPhone 9', brand: 'Apple', type: 'phone', released: 2017, height: 0.5 },
        { name: 'iPhone 8', brand: 'Apple', type: 'phone', released: 2016, power: '+8000' },
        { name: 'iPhone 8', brand: 'Apple', type: 'phone', released: 2016, mana: null },
    ]) as Collection<unknown>;

    const obj_collection_5 = collect([
        { name: '1100', brand: 'Nokia', type: 'phone', released: 1995 },
        { name: '1120', brand: 'Nokia', type: 'phone', released: 1995 },
        { name: '1150', brand: 'Nokia', type: 'phone', released: '1995' },
    ]) as Collection<unknown>;

    /* * * * */

    const array_collection_1 = collect([
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

    const string_collection_3 = collect([ 'a', 'b', 'b', 'c', 'c', 'c' ]) as Collection<string>;

    /* * * * */

    const number_collection_0 = collect([ 1, 2, 3, 4, 5 ]) as Collection<number>;

    const number_collection_1 = collect([ 1, 2.0, 3.333, 4.567, 5.0005, 10 ]) as Collection<number>;

    const number_collection_2 = collect([ 10, 20, 20, 30, 30, 30 ]) as Collection<number>;

    const number_collection_3 = collect([ 20, 30, 40 ]) as Collection<number>;

    const number_collection_4 = collect([ 1, 3, 2, 5, 9, 7, 6, 4, 8 ]) as Collection<number>;

    const number_collection_5 = collect([ 1, 2.0, '3.333', '4.567', 0.5, 10 ]) as Collection<unknown>;

    const number_collection_6 = collect([ 1, 2, 3, '2', '3', "3", 4, '4', "4", 4, 1, "3", "2", '1' ]) as Collection<unknown>;

    const number_collection_7 = collect([ 1, 3, 2, 2, 6, 4, 4, 12, 8 ]) as Collection<number>;

    /* * * * */

    const array_of_number_collection_1 = collect([ 
        [ 1, 2, 3 ], 
        [ 4, 5, 6 ], 
        [ 7, 8, 9 ], 
    ]) as Collection<number[]>;

    /* * * * */

    test('check collection item type', async () => {
        const result = number_collection_1.ensure('number');

        expect(result).toEqual(number_collection_1);
    });

    test('retrieve all collection items', async () => {
        const result = obj_collection_1.all();

        expect(result).toEqual([
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

    test('check if collection transform to json', async () => {
        const result_1 = string_collection_1.toJson();
        const result_2 = obj_collection_3.toJson();
        
        expect(result_1).toEqual("[\"foo\",\"bar\",\"baz\"]");
        expect(result_2).toEqual("[{\"name\":\"iPhone 14\",\"brand\":\"Apple\",\"type\":\"phone\",\"released\":2022}]");
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

        expect(result).toEqual(4.31675);
    });

    test('retrieve average collection item average count by key', async () => {
        const result = array_of_number_collection_1.average('1' as keyof number[]);

        expect(result).toEqual(5);
    });

    test('retrieve collection items by chunk', async () => {
        const result = obj_collection_1.chunk(2);

        expect(result.toArray()).toEqual([
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
        ]);
    });

    test('retrieve collection items by chunk while condition', async () => {
        const result = obj_collection_1.chunkWhile((_, index) => index < 3 || index >= 4);

        expect(result.toArray()).toEqual([
            [
                { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 },
                { name: 'iPhone 5', brand: 'Apple', type: 'phone', released: 2012 },
                { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
            ],
            [
                { name: 'Galaxy Gear', brand: 'Samsung', type: 'watch', released: 2013 },
            ]
        ]);
    });

    test('retrieve collection items by nth chunk', async () => {
        const result = obj_collection_1.nth(2, 1);

        expect(result.toArray()).toEqual([
            { name: 'iPhone 5', brand: 'Apple', type: 'phone', released: 2012 },
            { name: 'Galaxy S6', brand: 'Samsung', type: 'phone', released: 2015 },
        ]);
    });

    test('retrieve array collection items collapsed', async () => {
        const result = array_collection_1.collapse();

        expect(result.toArray()).toEqual([
            { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 },
            { name: 'iPhone 5', brand: 'Apple', type: 'phone', released: 2012 },
            { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
            { name: 'Galaxy S6', brand: 'Samsung', type: 'phone', released: 2015 },
            { name: 'Galaxy Gear', brand: 'Samsung', type: 'watch', released: 2013 },
        ]);
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
        
        expect(result.toArray()).toEqual([
            { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 },
            { name: 'iPhone 5', brand: 'Apple', type: 'phone', released: 2012 },
            { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
            { name: 'Galaxy S6', brand: 'Samsung', type: 'phone', released: 2015 },
            { name: 'Galaxy Gear', brand: 'Samsung', type: 'watch', released: 2013 },
            { name: 'iPhone 10', brand: 'Apple', type: 'phone', released: 2018 },
            { name: 'iPhone 9', brand: 'Apple', type: 'phone', released: 2017 },
            { name: 'iPhone 8', brand: 'Apple', type: 'phone', released: 2016 },
        ]);
    });

    test('retrieve collection with concatenated array', async () => {
        const result = obj_collection_1.concat(obj_collection_2.toArray());
        
        expect(result.toArray()).toEqual([
            { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 },
            { name: 'iPhone 5', brand: 'Apple', type: 'phone', released: 2012 },
            { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
            { name: 'Galaxy S6', brand: 'Samsung', type: 'phone', released: 2015 },
            { name: 'Galaxy Gear', brand: 'Samsung', type: 'watch', released: 2013 },
            { name: 'iPhone 10', brand: 'Apple', type: 'phone', released: 2018 },
            { name: 'iPhone 9', brand: 'Apple', type: 'phone', released: 2017 },
            { name: 'iPhone 8', brand: 'Apple', type: 'phone', released: 2016 },
        ]);
    });

    test('check if collection contains item', async () => {
        const result = number_collection_1.contains(1);
        
        expect(result).toBe(true);
    });

    test('check if collection contains item by key', async () => {
        const result = obj_collection_3.contains('brand' as never, 'Apple');
        
        expect(result).toBe(true);
    });

    test('check if collection contains strict item', async () => {
        const result_1 = obj_collection_5.containsStrict('released' as never, 1995);
        const result_2 = obj_collection_5.containsStrict('released' as never, '1995');
        
        expect(result_1).toBe(true);
        expect(result_2).toBe(true);
    });

    test('check if collection doesnt contain item', async () => {
        const result = number_collection_1.doesntContain(5);
        
        expect(result).toBe(true);
    });

    test('check if collection doesnt contain item by key', async () => {
        const result = obj_collection_3.doesntContain('brand' as never, 'Samsung');
        
        expect(result).toBe(true);
    });

    test('check if collection has some items', async () => {
        const result = number_collection_1.some(3.333);
        
        expect(result).toBe(true);
    });

    test('check if collection has some items by key', async () => {
        const result = obj_collection_1.some('brand' as never, 'Samsung');
        
        expect(result).toBe(true);
    });

    test('check if collection has some items by callback', async () => {
        const result = number_collection_1.some((item) => item >= 5);
        
        expect(result).toBe(true);
    });

    test('check if collection has only 1 item', async () => {
        const result = obj_collection_3.containsOneItem();
        
        expect(result).toBe(true);
    });
    
    test('retrieve collection with cross join', async () => {

        const arr = collect([ [ 'x', 'y' ], [ 1, 2 ] ]) as Collection<any[]>;

        const result_1 = number_collection_0.crossJoin(number_collection_3);
        const result_2 = arr.crossJoin();

        expect(result_1.toArray()).toEqual([
            [ 1, 20 ], [ 1, 30 ], [ 1, 40 ], 
            [ 2, 20 ], [ 2, 30 ], [ 2, 40 ], 
            [ 3, 20 ], [ 3, 30 ], [ 3, 40 ], 
            [ 4, 20 ], [ 4, 30 ], [ 4, 40 ], 
            [ 5, 20 ], [ 5, 30 ], [ 5, 40 ], 
        ]);
        expect(result_2.toArray()).toEqual([ [ 'x', 'y' ], [ 1, 2 ] ]);
    });

    test('retrieve collections difference', async () => {
        const result = number_collection_2.diff(number_collection_3);

        expect(result.toArray()).toEqual([ 10 ]);
    });

    test('retrieve collection duplicated items', async () => {
        const result = number_collection_2.duplicates();

        expect(result.toArray()).toEqual([ 20, 30, 30 ]);
    });

    test('retrieve collection with duplicated items by key', async () => {
        const result = obj_collection_1.duplicates('brand' as never);
        
        expect(result.toArray()).toEqual([ 'Apple', 'Apple', 'Samsung' ]);
    });

    test('retrieve collection strictly duplicated items', async () => {
        const result = obj_collection_5.duplicatesStrict('released' as never);

        expect(result.toArray()).toEqual([ 1995 ]);
    });

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

        expect(result.toArray()).toEqual([
            { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 },
            { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
            { name: 'Galaxy Gear', brand: 'Samsung', type: 'watch', released: 2013 },
        ]);
    });

    test('retrieve collection items filtered by', async () => {
        const result = obj_collection_1.filter((item, index) => {
            return ((item as Record<string, any>).brand === 'Apple') && (index > 0);
        });

        expect(result.toArray()).toEqual([
            { name: 'iPhone 5', brand: 'Apple', type: 'phone', released: 2012 },
            { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
        ]);
    });

    test('retrieve collection items rejected by', async () => {
        const result = obj_collection_1.reject((item, index) => {
            return ((item as Record<string, any>).brand === 'Apple') && (index > 0);
        });

        expect(result.toArray()).toEqual([
            { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 },
            { name: 'Galaxy S6', brand: 'Samsung', type: 'phone', released: 2015 },
            { name: 'Galaxy Gear', brand: 'Samsung', type: 'watch', released: 2013 },
        ]);
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

    test('retrieve collection first or fail item', async () => {
        expect(() => obj_collection_1.firstOrFail((item) => {
            return (item as Record<string, any>).brand === 'Motorola';
        })).toThrow('No matching item found');
    });

    test('retrieve collection last item', async () => {
        const result = obj_collection_1.last((item) => {
            return (item as Record<string, any>).brand === 'Apple';
        });

        expect(result).toEqual({ name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 });
    });

    test('retrieve collection items mapped', async () => {

        const collection = collect([
            { name: 'iPhone 10', brand: 'Apple', type: 'phone', released: 2018 },
            { name: 'iPhone 9', brand: 'Apple', type: 'phone', released: 2017 },
            { name: 'iPhone 8', brand: 'Apple', type: 'phone', released: 2016 },
        ]);

        const result = collection.map((item, index) => {
            (item as Record<string, any>).weight = 1 * (index + 1)
            return item;
        });

        expect(result.toArray()).toEqual([
            { name: 'iPhone 10', brand: 'Apple', type: 'phone', released: 2018, weight: 1 },
            { name: 'iPhone 9', brand: 'Apple', type: 'phone', released: 2017, weight: 2 },
            { name: 'iPhone 8', brand: 'Apple', type: 'phone', released: 2016, weight: 3 },
        ]);
    });

    test('retrieve collection items mapped into', async () => {
        const result = obj_collection_2.mapInto(TestClass);

        const a = [
            new TestClass({ name: 'iPhone 10', brand: 'Apple', type: 'phone', released: 2018 }), 
            new TestClass({ name: 'iPhone 9', brand: 'Apple', type: 'phone', released: 2017 }), 
            new TestClass({ name: 'iPhone 8', brand: 'Apple', type: 'phone', released: 2016 }), 
        ];

        expect(result.toArray()).toEqual(a);
    });

    test('retrieve collection items spread mapped', async () => {
        const result = array_collection_1.mapSpread((...args) => args.reduce(
            (carry: Record<string, any>[], item: any) => {
                if (item.brand === 'Apple') {
                    carry.push(item);
                }
                return carry;
            }, 
            []
        ));

        expect(result.toArray()).toEqual([
            [
                { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 },
                { name: 'iPhone 5', brand: 'Apple', type: 'phone', released: 2012 },
            ],
            [
                { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
            ],
            [
                // empty
            ]
        ]);
    });

    test('retrieve collection items mapped to groups', async () => {
        const result = obj_collection_1.mapToGroups((item) => item as Record<string, any>);

        expect(result).toEqual({
            name: [
                'iPhone 6',
                'iPhone 5',
                'Apple Watch',
                'Galaxy S6',
                'Galaxy Gear',
            ],
            brand: [
                'Apple',
                'Apple',
                'Apple',
                'Samsung',
                'Samsung',
            ],
            type: [
                'phone',
                'phone',
                'watch',
                'phone',
                'watch',
            ],
            released: [
                2014,
                2012,
                2015,
                2015,
                2013,
            ]
        });
    });

    test('retrieve collection items mapped with keys', async () => {
        const result = obj_collection_4.mapWithKeys((item) => item as Record<string, any>);

        expect(result).toEqual({ 
            name: 'iPhone 8', 
            brand: 'Apple', 
            type: 'phone', 
            released: 2016, 
            weight: 0.75, 
            height: 0.5, 
            power: '+8000', 
            mana: null, 
        });
    });

    test('retrieve collection items flat mapped', async () => {

        const collection = collect([
            { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 },
            { name: 'iPhone 5', brand: 'Apple', type: 'phone', released: 2012 },
            { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
            { name: 'Galaxy S6', brand: 'Samsung', type: 'phone', released: 2015 },
            { name: 'Galaxy Gear', brand: 'Samsung', type: 'watch', released: 2013 },
        ])

        const result = collection.flatMap((item) => {
            if ((item as Record<string, any>).brand !== 'Apple') {
                (item as Record<string, any>).better = true;
            }
            return item;
        });

        expect(result.toArray()).toEqual([
            { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 },
            { name: 'iPhone 5', brand: 'Apple', type: 'phone', released: 2012 },
            { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
            { name: 'Galaxy S6', brand: 'Samsung', type: 'phone', released: 2015, better: true },
            { name: 'Galaxy Gear', brand: 'Samsung', type: 'watch', released: 2013, better: true },
        ]);
    });

    test('retrieve collection items reduced', async () => {
        const result = string_collection_1.reduce(
            (carry: string[] | null, item: string, index: number): string[] => {
                carry![index] = `${item} #${index + 1}`;
                return carry as string[];
            }, 
            []
        );

        expect(result).toEqual([ 'foo #1', 'bar #2', 'baz #3' ]);
    });

    test('retrieve collection with forgotten item', async () => {

        const collection = collect([ 20, 30, 40 ]);

        const result = collection.forget(1);

        expect(result.toArray()).toEqual([ 20, 40 ]);
        expect(result.toArray()).not.toContain([ 30 ]);
    });

    test('retrieve collection with items for page', async () => {
        const result = number_collection_2.forPage(2, 3);
        
        expect(result.toArray()).toEqual([ 30, 30, 30 ]);
    });

    test('retrieve collection item', async () => {
        const result_1 = number_collection_2.get(3);
        const result_2 = obj_collection_1.get(2);
        
        expect(result_1).toBe(30);
        expect(result_2).toEqual({ name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 });
    });

    test('retrieve collection items grouped by key', async () => {
        const result = obj_collection_1.groupBy('brand' as never);
        
        expect(result).toEqual({ 
            Apple: [
                { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 },
                { name: 'iPhone 5', brand: 'Apple', type: 'phone', released: 2012 },
                { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
            ], 
            Samsung: [
                { name: 'Galaxy S6', brand: 'Samsung', type: 'phone', released: 2015 },
                { name: 'Galaxy Gear', brand: 'Samsung', type: 'watch', released: 2013 },
            ]
        });
    });

    test('retrieve collection items grouped by keys', async () => {
        const result = obj_collection_1.groupBy(['brand', 'type'] as never[]);
        
        expect(result).toEqual({ 
            Apple: {
                phone: [
                    { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 },
                    { name: 'iPhone 5', brand: 'Apple', type: 'phone', released: 2012 },
                ],
                watch: [
                    { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
                ]
            }, 
            Samsung: {
                phone: [
                    { name: 'Galaxy S6', brand: 'Samsung', type: 'phone', released: 2015 },
                ],
                watch: [
                    { name: 'Galaxy Gear', brand: 'Samsung', type: 'watch', released: 2013 },
                ]
            }
        });
    });

    test('retrieve collection items grouped by callback fn', async () => {
        const result = obj_collection_1.groupBy(
            (item) => ((item as Record<string, any>).released >= 2014) as never
        );
        
        expect(result).toEqual({ 
            true: [
                { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 },
                { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
                { name: 'Galaxy S6', brand: 'Samsung', type: 'phone', released: 2015 },
            ],
            false: [
                { name: 'iPhone 5', brand: 'Apple', type: 'phone', released: 2012 },
                { name: 'Galaxy Gear', brand: 'Samsung', type: 'watch', released: 2013 },
            ]
        });
    });

    test('retrieve collection has item by index', async () => {
        const result_1 = obj_collection_1.has(2);
        const result_2 = obj_collection_1.has(5);
        
        expect(result_1).toBe(true);
        expect(result_2).toBe(false);
    });

    test('retrieve collection has items by indexes', async () => {
        const result_1 = obj_collection_1.hasAny([ 0, 2 ]);
        const result_2 = obj_collection_1.hasAny([ 5, 7, 9 ]);
        
        expect(result_1).toBe(true);
        expect(result_2).toBe(false);
    });

    test('retrieve collection implode', async () => {
        const result = string_collection_1.implode(',');
        
        expect(result).toEqual('foo,bar,baz');
    });

    test('retrieve collection implode by key', async () => {
        const result = obj_collection_2.implode('name' as never, ',');
        
        expect(result).toEqual('iPhone 10,iPhone 9,iPhone 8');
    });

    test('retrieve collection implode by callback', async () => {
        const result = obj_collection_2.implode((item, index) => `${(item as Record<string, any>).name} ${index + 1}` , ',');
        
        expect(result).toEqual('iPhone 10 1,iPhone 9 2,iPhone 8 3');
    });

    test('retrieve collection intersection', async () => {
        const result = number_collection_4.intersect(number_collection_7);

        expect(result.toArray()).toEqual([ 1, 3, 2, 6, 4, 8 ]);
    });

    test('check if collection is empty', async () => {
        const result_1 = empty_collection.isEmpty();
        const result_2 = obj_collection_2.isEmpty();
        
        expect(result_1).toBe(true);
        expect(result_2).toBe(false);
    });

    test('check if collection is not empty', async () => {
        const result_1 = empty_collection.isNotEmpty();
        const result_2 = obj_collection_2.isNotEmpty();
        
        expect(result_1).toBe(false);
        expect(result_2).toBe(true);
    });

    test('retrieve collection join', async () => {
        const result = string_collection_1.join(',');
        
        expect(result).toEqual('foo,bar,baz');
    });

    test('retrieve collection join final', async () => {
        const result = string_collection_1.join(',', ' and ');
        
        expect(result).toEqual('foo,bar and baz');
    });

    test('retrieve collection key by', async () => {
        const result_1 = obj_collection_1.keyBy('name' as never);
        const result_2 = obj_collection_1.keyBy('brand' as never);
        const result_3 = obj_collection_1.keyBy('released' as never);
        
        expect(result_1).toEqual({
            'iPhone 6': { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 },
            'iPhone 5': { name: 'iPhone 5', brand: 'Apple', type: 'phone', released: 2012 },
            'Apple Watch': { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
            'Galaxy S6': { name: 'Galaxy S6', brand: 'Samsung', type: 'phone', released: 2015 },
            'Galaxy Gear': { name: 'Galaxy Gear', brand: 'Samsung', type: 'watch', released: 2013 },
        });
        expect(result_2).toEqual({
            Apple: { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
            Samsung: { name: 'Galaxy Gear', brand: 'Samsung', type: 'watch', released: 2013 },
        });
        expect(result_3).toEqual({
            2012: { name: 'iPhone 5', brand: 'Apple', type: 'phone', released: 2012 },
            2013: { name: 'Galaxy Gear', brand: 'Samsung', type: 'watch', released: 2013 },
            2014: { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 },
            2015: { name: 'Galaxy S6', brand: 'Samsung', type: 'phone', released: 2015 },
        });
    });

    test('retrieve collection key by callback', async () => {
        const result = obj_collection_1.keyBy((item, index) => `${(item as Record<string, any>).brand} ${index + 1}`);
        
        expect(result).toEqual({
            'Apple 1': { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 },
            'Apple 2': { name: 'iPhone 5', brand: 'Apple', type: 'phone', released: 2012 },
            'Apple 3': { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
            'Samsung 4': { name: 'Galaxy S6', brand: 'Samsung', type: 'phone', released: 2015 },
            'Samsung 5': { name: 'Galaxy Gear', brand: 'Samsung', type: 'watch', released: 2013 },
        });
    });

    test('retrieve collection max', async () => {
        const result = number_collection_4.max();
        
        expect(result).toEqual(9);
    });

    test('retrieve collection max with key', async () => {
        const result = obj_collection_1.max('released' as never);
        
        expect(result).toEqual(2015);
    });

    test('retrieve collection median', async () => {
        const result = number_collection_4.median();
        
        expect(result).toEqual(5);
    });

    test('retrieve collection median with key', async () => {
        const result = obj_collection_1.median('released' as never);
        
        expect(result).toEqual(2014);
    });

    test('retrieve collection min', async () => {
        const result = number_collection_4.min();
        
        expect(result).toEqual(1);
    });

    test('retrieve collection min with key', async () => {
        const result = obj_collection_1.min('released' as never);
        
        expect(result).toEqual(2012);
    });

    test('retrieve collection percentage', async () => {
        const result = obj_collection_1.percentage((item) => (item as Record<string, any>).brand === 'Apple');
        
        expect(result).toEqual(60);
    });

    test('retrieve collection merged items', async () => {
        const result = number_collection_2.merge(number_collection_3);
        
        expect(result.toArray()).toEqual([ 10, 20, 20, 30, 30, 30, 20, 30, 40 ]);
    });

    test('retrieve collection mode', async () => {
        const result = string_collection_1.mode();
        
        expect(result).toEqual([ 'foo', 'bar', 'baz' ]);
    });

    test('retrieve collection mode with key', async () => {
        const result = obj_collection_1.mode('brand' as never);
        
        expect(result).toEqual([ 'Apple' ]);
    });

    test('retrieve collection items only by given indexes', async () => {
        const result = obj_collection_1.only([ 0, 2, 4 ]);
        
        expect(result.toArray()).toEqual([
            { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 },
            { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
            { name: 'Galaxy Gear', brand: 'Samsung', type: 'watch', released: 2013 },
        ]);
    });

    test('retrieve collection items pad', async () => {

        const value = { name: 'iPhone 14', brand: 'Apple', type: 'phone', released: 2022 };

        const result_1 = obj_collection_1.pad(-10, value);
        const result_2 = obj_collection_1.pad(3, value);
        const result_3 = obj_collection_1.pad(10, value);
        
        expect(result_1.toArray()).toEqual([
            { name: 'iPhone 14', brand: 'Apple', type: 'phone', released: 2022 },
            { name: 'iPhone 14', brand: 'Apple', type: 'phone', released: 2022 },
            { name: 'iPhone 14', brand: 'Apple', type: 'phone', released: 2022 },
            { name: 'iPhone 14', brand: 'Apple', type: 'phone', released: 2022 },
            { name: 'iPhone 14', brand: 'Apple', type: 'phone', released: 2022 },
            { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 },
            { name: 'iPhone 5', brand: 'Apple', type: 'phone', released: 2012 },
            { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
            { name: 'Galaxy S6', brand: 'Samsung', type: 'phone', released: 2015 },
            { name: 'Galaxy Gear', brand: 'Samsung', type: 'watch', released: 2013 },
        ]);
        
        expect(result_2.toArray()).toEqual(obj_collection_1.toArray());
        
        expect(result_3.toArray()).toEqual([
            { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 },
            { name: 'iPhone 5', brand: 'Apple', type: 'phone', released: 2012 },
            { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
            { name: 'Galaxy S6', brand: 'Samsung', type: 'phone', released: 2015 },
            { name: 'Galaxy Gear', brand: 'Samsung', type: 'watch', released: 2013 },
            { name: 'iPhone 14', brand: 'Apple', type: 'phone', released: 2022 },
            { name: 'iPhone 14', brand: 'Apple', type: 'phone', released: 2022 },
            { name: 'iPhone 14', brand: 'Apple', type: 'phone', released: 2022 },
            { name: 'iPhone 14', brand: 'Apple', type: 'phone', released: 2022 },
            { name: 'iPhone 14', brand: 'Apple', type: 'phone', released: 2022 },
        ]);
    });

    test('retrieve collection items prepend', async () => {

        const value = { name: 'iPhone 14', brand: 'Apple', type: 'phone', released: 2022 };

        const collection = collect([
            { name: 'iPhone 10', brand: 'Apple', type: 'phone', released: 2018 },
            { name: 'iPhone 9', brand: 'Apple', type: 'phone', released: 2017 },
            { name: 'iPhone 8', brand: 'Apple', type: 'phone', released: 2016 },
        ]);
        
        const result = collection.prepend(value);
        
        expect(result).toEqual(4);
    });

    test('retrieve collection items partition', async () => {
        const result = obj_collection_1.partition((item, index) => {
            return ((item as Record<string, any>).brand === 'Apple') && (index > 0);
        });

        const resolve = result.map((collection) => collection.toArray());
        
        expect(resolve).toEqual([
            [
                { name: 'iPhone 5', brand: 'Apple', type: 'phone', released: 2012 },
                { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
            ],
            [
                { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 },
                { name: 'Galaxy S6', brand: 'Samsung', type: 'phone', released: 2015 },
                { name: 'Galaxy Gear', brand: 'Samsung', type: 'watch', released: 2013 },
            ]
        ]);
    });

    test('retrieve collection items pipe', async () => {
        const result = obj_collection_1.pipe((item) => {

            const name = (item as Record<string, any>).name;
            const brand = (item as Record<string, any>).brand;

            if (name && name === 'Apple') {
                // do something
            }
            if (brand) {
                // do something
            }
            
            return item;
        });
        
        expect(result.toArray()).toEqual(obj_collection_1.toArray());
    });

    test('retrieve collection items pipe through', async () => {

        const pipeline = [
            (item: Record<string, any>) => {

                const name = item.name;
                const brand = item.brand;
    
                if (name && name === 'Apple') {
                    // do something
                }
                if (brand) {
                    // do something
                }
                
                return item;
            },
            (item: Record<string, any>) => {
    
                if (item.power && item.power > 8000) {
                    // do something
                }
                
                return item;
            }
        ];

        const result = obj_collection_1.pipeThrough(pipeline);
        
        expect(result.toArray()).toEqual(obj_collection_1.toArray());
    });

    test('retrieve collection items pipe into', async () => {
        const result = obj_collection_1.pipeInto(TestClass);

        const a = new TestClass(obj_collection_1);
        
        expect(result).toEqual(a);
    });

    test('retrieve collection items tap', async () => {
        const result = obj_collection_1.tap((item) => {

            const name = (item as Record<string, any>).name;
            const brand = (item as Record<string, any>).brand;

            if (name && name === 'Apple') {
                // do something
            }
            if (brand) {
                // do something
            }
            
            return item;
        });
        
        expect(result).toEqual(obj_collection_1);
    });

    test('retrieve collection items pluck', async () => {
        const result = obj_collection_1.pluck('name' as  never);
        
        expect(result.toArray()).toEqual([
            'iPhone 6',
            'iPhone 5',
            'Apple Watch',
            'Galaxy S6',
            'Galaxy Gear',
        ]);
    });

    test('retrieve collection items pop', async () => {
        const result = string_collection_1.pop();
        
        expect(result).toEqual('baz');
    });

    test('retrieve collection items pop amount', async () => {
        const result = string_collection_1.pop(2);
        
        expect(result.toArray()).toEqual([ 'foo', 'bar' ]);
    });

    test('retrieve collection items pull', async () => {

        const collection = collect([ 1, 2.0, 3.333, 4.567, 5.0005, 10 ]);

        const result = collection.pull(2);
        
        expect(result).toEqual(3.333);
    });

    test('retrieve collection items push', async () => {

        const collection = collect([ 20, 30, 40 ]);

        const result = collection.push(50);
        
        expect(result).toEqual(4);
    });

    test('retrieve collection items put', async () => {

        const collection = collect([ 20, 30, 40 ]);

        const result_1 = collection.put(3, 30);
        expect(result_1.toArray()).toEqual([ 20, 30, 40, 30 ]);
        
        const result_2 = collection.put(1, 50);
        expect(result_2.toArray()).toEqual([ 20, 50, 40, 30 ]);
    });

    test('retrieve collection random items', async () => {

        const result_1 = obj_collection_1.random(1);
        const result_2 = obj_collection_1.random(3);

        expect(result_1).not.toBeNull();
        // expect(result_1.toArray()).toContain([
            
        // ]);

        expect(result_2).not.toBeNull();
        expect(result_2.count()).toBe(3);
        // expect(result_2.toArray()).toContain([
            
        // ]);
    });

    test('retrieve collection item replace', async () => {
        const result = string_collection_1.replace({ 1: 'lorem' });
        
        expect(result.toArray()).toEqual([ undefined, 'lorem' ]);
    });

    test('retrieve collection reverse', async () => {
        const result = array_of_number_collection_1.reverse();
        
        expect(result.toArray()).toEqual([ [ 7, 8, 9 ], [ 4, 5, 6 ], [ 1, 2, 3 ] ]);
    });

    test('retrieve collection search', async () => {
        const result = number_collection_1.search(1);
        
        expect(result).toEqual(0);
    });

    test('retrieve collection search strict', async () => {
        const result = number_collection_5.search('3.333', true);
        
        expect(result).toEqual(2);
    });

    test('retrieve collection search by callback', async () => {
        const result = number_collection_1.search((item: number, index: number) => {
            return item === (index + 1) && index === 0;
        });
        
        expect(result).toEqual(0);
    });

    test('retrieve collection select', async () => {
        const result = obj_collection_1.select([ 'name', 'brand' ] as never[]);
        
        expect(result.toArray()).toEqual([
            { name: 'iPhone 6', brand: 'Apple' },
            { name: 'iPhone 5', brand: 'Apple' },
            { name: 'Apple Watch', brand: 'Apple' },
            { name: 'Galaxy S6', brand: 'Samsung' },
            { name: 'Galaxy Gear', brand: 'Samsung' },
        ]);
    });

    test('retrieve collection shift', async () => {

        const collection = collect([
            { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 },
            { name: 'iPhone 5', brand: 'Apple', type: 'phone', released: 2012 },
            { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
            { name: 'Galaxy S6', brand: 'Samsung', type: 'phone', released: 2015 },
            { name: 'Galaxy Gear', brand: 'Samsung', type: 'watch', released: 2013 },
        ]);

        const result_1 = collection.shift();
        const result_2 = collection.shift(3);
        
        expect(result_1).toEqual({ name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 });
        
        expect(result_2.toArray()).toEqual([
            { name: 'iPhone 5', brand: 'Apple', type: 'phone', released: 2012 },
            { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
            { name: 'Galaxy S6', brand: 'Samsung', type: 'phone', released: 2015 },
        ]);
    });

    /**
     * @toReview
     */
    test.skip('retrieve collection shuffle', async () => {
        const result = obj_collection_1.shuffle();
        
        expect(result.toArray()).toContain([
            { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 },
            { name: 'iPhone 5', brand: 'Apple', type: 'phone', released: 2012 },
            { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
            { name: 'Galaxy S6', brand: 'Samsung', type: 'phone', released: 2015 },
            { name: 'Galaxy Gear', brand: 'Samsung', type: 'watch', released: 2013 },
        ]);
    });

    test('retrieve collection skip', async () => {
        const result = obj_collection_1.skip(2);
        
        expect(result.toArray()).toEqual([
            { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
            { name: 'Galaxy S6', brand: 'Samsung', type: 'phone', released: 2015 },
            { name: 'Galaxy Gear', brand: 'Samsung', type: 'watch', released: 2013 },
        ]);
    });

    test('retrieve collection skip until', async () => {
        const result = number_collection_1.skipUntil(4.567);
        
        expect(result.toArray()).toEqual([ 4.567, 5.0005, 10 ]);
    });

    test('retrieve collection skip until callback', async () => {
        const result = number_collection_1.skipUntil((item, index) => {
            return item >= 3 && index > 1;
        });
        
        expect(result.toArray()).toEqual([ 3.333, 4.567, 5.0005, 10 ]);
    });

    test('retrieve collection skip while', async () => {
        const result = number_collection_1.skipWhile(4.567);
        
        expect(result.toArray()).toEqual([ 1, 2.0, 3.333, 4.567, 5.0005, 10 ]);
    });

    test('retrieve collection skip while callback', async () => {
        const result = number_collection_1.skipWhile((item) => {
            return item < 3;
        });
        
        expect(result.toArray()).toEqual([ 3.333, 4.567, 5.0005, 10 ]);
    });

    test('retrieve collection slice', async () => {
        const result_1 = number_collection_1.slice(1, 1);
        const result_2 = number_collection_1.slice(1, 3);
        
        expect(result_1.toArray()).toEqual([ 2 ]);
        expect(result_2.toArray()).toEqual([ 2, 3.333, 4.567 ]);
    });

    test('retrieve collection splice', async () => {

        const collection = collect([ 1, 2.0, 3.333, 4.567, 5.0005, 10 ]);

        const result = collection.splice(2, 1);
        
        expect(result.toArray()).toEqual([ 3.333 ]);
    });

    test('retrieve collection split', async () => {
        const result = number_collection_1.split(3);
        
        expect(result.toArray()).toEqual([
            [ 1, 2.0 ],
            [ 2.0, 3.333, 4.567 ],
            [ 3.333, 4.567, 5.0005, 10 ],
        ]);
    });

    test('retrieve collection split in', async () => {
        const result = number_collection_1.splitIn(2);
        
        expect(result.toArray()).toEqual([
            [ 1, 2.0, 3.333 ],
            [ 4.567, 5.0005, 10 ],
        ]);
    });

    test('retrieve collection sliding', async () => {
        const result = obj_collection_2.sliding(2);
        
        expect(result.toArray()).toEqual([
            ([
                { name: 'iPhone 10', brand: 'Apple', type: 'phone', released: 2018 },
                { name: 'iPhone 9', brand: 'Apple', type: 'phone', released: 2017 },
            ]),
            ([
                { name: 'iPhone 9', brand: 'Apple', type: 'phone', released: 2017 },
                { name: 'iPhone 8', brand: 'Apple', type: 'phone', released: 2016 },
            ])
        ]);
    });

    test('retrieve collection sole', async () => {
        const result_1 = obj_collection_3.sole();
        const result_2 = obj_collection_2.sole();
        
        expect(result_1).toEqual({ name: 'iPhone 14', brand: 'Apple', type: 'phone', released: 2022 });
        expect(result_2).toBeNull();
    });

    test('retrieve collection sole by key', async () => {
        const result = obj_collection_2.sole('name' as never, 'iPhone 9');
        
        expect(result).toEqual({ name: 'iPhone 9', brand: 'Apple', type: 'phone', released: 2017 });
    });
    
    test('retrieve collection sole by callback', async () => {
        const result_1 = obj_collection_2.sole((item, index) => (item as Record<string, any>).brand === 'Apple' && index === 2);
        const result_2 = obj_collection_2.sole((item, index) => (item as Record<string, any>).brand === 'Apple' && index >= 1);

        expect(result_1).toEqual({ name: 'iPhone 8', brand: 'Apple', type: 'phone', released: 2016 });
        expect(result_2).toBeNull();
    });

    test('retrieve collection sole by key', async () => {
        const result = obj_collection_2.sole('name' as never, 'iPhone 9');
        
        expect(result).toEqual({ name: 'iPhone 9', brand: 'Apple', type: 'phone', released: 2017 });
    });

    test('retrieve collection sorted by', async () => {
        const result = obj_collection_1.sortBy('name' as never);
        
        expect(result.toArray()).toEqual([
            { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
            { name: 'Galaxy Gear', brand: 'Samsung', type: 'watch', released: 2013 },
            { name: 'Galaxy S6', brand: 'Samsung', type: 'phone', released: 2015 },
            { name: 'iPhone 5', brand: 'Apple', type: 'phone', released: 2012 },
            { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 },
        ]);
    });

    test('retrieve collection sorted columns by', async () => {
        const result = array_collection_1.sortBy([
            ['released' as never, 'desc' as never], 
            ['released' as never, 'asc' as never], 
            ['brand' as never, 'asc' as never]
        ]);
        
        expect(result.toArray()).toEqual([
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
        ]);
    });

    test('retrieve collection sorted by callback', async () => {
        const result = obj_collection_1.sortBy((item): any => {

            let released = 0;

            (item as Record<string, any>).released
                .toString()
                .split('')
                .forEach((num: number) => released += num);

            return (item as Record<string, any>).name.length + released;
        });
        
        expect(result.toArray()).toEqual([
            { name: 'iPhone 5', brand: 'Apple', type: 'phone', released: 2012 },
            { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 },
            { name: 'Galaxy S6', brand: 'Samsung', type: 'phone', released: 2015 },
            { name: 'Galaxy Gear', brand: 'Samsung', type: 'watch', released: 2013 },
            { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
        ]);
    });

    test('retrieve collection sorted desc by', async () => {
        const result = number_collection_1.sortDesc();
        
        expect(result.toArray()).toEqual([ 10, 5.0005, 4.567, 3.333, 2.0, 1 ]);
    });

    test('retrieve collection items take', async () => {
        const result = number_collection_1.take(3);
        
        expect(result.toArray()).toEqual([ 1, 2.0, 3.333 ]);
    });

    test('retrieve collection items take until', async () => {
        const result = number_collection_1.takeUntil(5.0005);
        
        expect(result.toArray()).toEqual([ 1, 2.0, 3.333, 4.567 ]);
    });

    test('retrieve collection items take until callback', async () => {
        const result = number_collection_1.takeUntil((item, index) => {
            return item > 4 || index === 3;
        });
        
        expect(result.toArray()).toEqual([ 1, 2.0, 3.333 ]);
    });

    test('retrieve collection items take while', async () => {

        const collection = collect([ 1, 1, 2, 1 ]);

        const result = collection.takeWhile(1);
        
        expect(result.toArray()).toEqual([ 1, 1 ]);
    });

    test('retrieve collection items take while callback', async () => {
        const result = number_collection_1.takeWhile((number) => number < 5);
        
        expect(result.toArray()).toEqual([ 1, 2.0, 3.333, 4.567 ]);
    });

    test('retrieve collection items transform', async () => {

        const collection = collect([
            { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 },
            { name: 'iPhone 5', brand: 'Apple', type: 'phone', released: 2012 },
            { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
            { name: 'Galaxy S6', brand: 'Samsung', type: 'phone', released: 2015 },
            { name: 'Galaxy Gear', brand: 'Samsung', type: 'watch', released: 2013 },
        ]);

        const result = collection.transform((item, index) => {

            const released = (item as Record<string, any>).released + index + 10;

            (item as Record<string, any>).released = released;
            
            return item;
        });
        
        expect(result.toArray()).toEqual([
            { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2024 },
            { name: 'iPhone 5', brand: 'Apple', type: 'phone', released: 2023 },
            { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2027 },
            { name: 'Galaxy S6', brand: 'Samsung', type: 'phone', released: 2028 },
            { name: 'Galaxy Gear', brand: 'Samsung', type: 'watch', released: 2027 },
        ]);
    });

    test('retrieve collection items unique', async () => {
        const result = string_collection_3.unique();
        
        expect(result.toArray()).toEqual([ 'a', 'b', 'c' ]);
    });

    test('retrieve collection items unique by key', async () => {
        const result = obj_collection_1.unique('brand' as never);
        
        expect(result.toArray()).toEqual([
            { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 },
            { name: 'Galaxy S6', brand: 'Samsung', type: 'phone', released: 2015 },
        ]);
    });

    test('retrieve collection items unique strict', async () => {
        const result = number_collection_6.uniqueStrict();
        
        expect(result.toArray()).toEqual([ 1, 2, 3, '2', '3', 4, '4', '1' ]);
    });

    test('retrieve collection items unique strict by key', async () => {
        const result = obj_collection_5.uniqueStrict('released' as never);
        
        expect(result.toArray()).toEqual([
            { name: '1100', brand: 'Nokia', type: 'phone', released: 1995 },
            { name: '1150', brand: 'Nokia', type: 'phone', released: '1995' },
        ]);
    });

    test('retrieve collection items unless', async () => {

        const collection = collect([
            { name: 'iPhone 10', brand: 'Apple', type: 'phone', released: 2018 },
            { name: 'iPhone 9', brand: 'Apple', type: 'phone', released: 2017 },
            { name: 'iPhone 8', brand: 'Apple', type: 'phone', released: 2016 },
        ]);

        const a = (collection: any) => {
            return collection.slice(3, collection.count() - 3);
        };
        const b = (collection: any) => {
            collection.put(1, { name: 'foo' });
            return collection;
        };

        const result = collection.unless(collection.count() <= 3, a, b);
        
        expect(result.toArray()).toEqual([
            { name: 'iPhone 10', brand: 'Apple', type: 'phone', released: 2018 },
            { name: 'foo' },
            { name: 'iPhone 8', brand: 'Apple', type: 'phone', released: 2016 }, 
        ]);
    });

    test('retrieve collection items unless empty', async () => {

        const collection = collect([]);

        const a = (collection: any) => {
            collection.put(0, 'foo');
            return collection;
        };
        const b = (collection: any) => {
            collection.put(0, 'bar');
            return collection;
        };

        const result = collection.unlessEmpty(a, b);
        
        expect(result.toArray()).toEqual([ 'bar' ]);
    });

    test('retrieve collection items unless not empty', async () => {

        const collection = collect([]);

        const a = (collection: any) => {
            collection.put(0, 'foo');
            return collection;
        };
        const b = (collection: any) => {
            collection.put(0, 'bar');
            return collection;
        };

        const result = collection.unlessNotEmpty(a, b);
        
        expect(result.toArray()).toEqual([ 'foo' ]);
    });

    test('retrieve collection item value', async () => {
        const result = obj_collection_1.value('brand' as never);
        
        expect(result).toEqual('Apple');
    });

    test('retrieve collection items when', async () => {

        const collection = collect([]);

        const a = (collection: any) => {
            collection.put(0, 'foo');
            return collection;
        };
        const b = (collection: any) => {
            collection.put(0, 'bar');
            return collection;
        };

        const result = collection.when(collection.count() === 0, a, b);
        
        expect(result.toArray()).toEqual([ 'foo' ]);
    });

    test('retrieve collection items when empty', async () => {

        const collection = collect([]);

        const a = (collection: any) => {
            collection.put(0, 'foo');
            return collection;
        };
        const b = (collection: any) => {
            collection.put(0, 'bar');
            return collection;
        };

        const result = collection.whenEmpty(a, b);
        
        expect(result.toArray()).toEqual([ 'foo' ]);
    });

    test('retrieve collection items when not empty', async () => {

        const collection = collect([]);

        const a = (collection: any) => {
            collection.put(0, 'foo');
            return collection;
        };
        const b = (collection: any) => {
            collection.put(0, 'bar');
            return collection;
        };

        const result = collection.whenNotEmpty(a, b);
        
        expect(result.toArray()).toEqual([ 'bar' ]);
    });

    test('retrieve collection items where', async () => {
        const result = obj_collection_1.where('brand' as never, 'Apple');
        
        expect(result.toArray()).toEqual([
            { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 },
            { name: 'iPhone 5', brand: 'Apple', type: 'phone', released: 2012 },
            { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
        ]);
    });

    test('retrieve collection items where like', async () => {
        const result = obj_collection_1.where('released' as never, '>=', 2014);
        
        expect(result.toArray()).toEqual([
            { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 },
            { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
            { name: 'Galaxy S6', brand: 'Samsung', type: 'phone', released: 2015 },
        ]);
    });

    test('retrieve collection items where strict', async () => {
        const result = obj_collection_5.whereStrict('released' as never, 1995);
        
        expect(result.toArray()).toEqual([
            { name: '1100', brand: 'Nokia', type: 'phone', released: 1995 },
            { name: '1120', brand: 'Nokia', type: 'phone', released: 1995 },
        ]);
    });

    test('retrieve collection items where between', async () => {
        const result = obj_collection_1.whereBetween('released' as never, [2012, 2014]);
        
        expect(result.toArray()).toEqual([
            { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 },
            { name: 'iPhone 5', brand: 'Apple', type: 'phone', released: 2012 },
            { name: 'Galaxy Gear', brand: 'Samsung', type: 'watch', released: 2013 },
        ]);
    });

    test('retrieve collection items where not between', async () => {
        const result = obj_collection_1.whereNotBetween('released' as never, [2012, 2014]);
        
        expect(result.toArray()).toEqual([
            { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
            { name: 'Galaxy S6', brand: 'Samsung', type: 'phone', released: 2015 },
        ]);
    });

    test('retrieve collection items where in', async () => {
        const result = obj_collection_1.whereIn('released' as never, [2012, 2015]);
        
        expect(result.toArray()).toEqual([
            { name: 'iPhone 5', brand: 'Apple', type: 'phone', released: 2012 },
            { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
            { name: 'Galaxy S6', brand: 'Samsung', type: 'phone', released: 2015 },
        ]);
    });

    test('retrieve collection items where not in', async () => {
        const result = obj_collection_1.whereNotIn('released' as never, [2012, 2015]);
        
        expect(result.toArray()).toEqual([
            { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 },
            { name: 'Galaxy Gear', brand: 'Samsung', type: 'watch', released: 2013 },
        ]);
    });

    test('retrieve collection items where null', async () => {
        const result = obj_collection_4.whereNull('mana' as never);
        
        expect(result.toArray()).toEqual([{ name: 'iPhone 8', brand: 'Apple', type: 'phone', released: 2016, mana: null }]);
    });

    test('retrieve collection items where not null', async () => {
        const result = obj_collection_4.whereNotNull('mana' as never);
        
        expect(result.toArray()).toEqual([
            { name: 'iPhone 10', brand: 'Apple', type: 'phone', released: 2018, weight: 0.75 },
            { name: 'iPhone 9', brand: 'Apple', type: 'phone', released: 2017, height: 0.5 },
            { name: 'iPhone 8', brand: 'Apple', type: 'phone', released: 2016, power: '+8000' },
        ]);
    });

    test('retrieve collection items where instance of', async () => {

        const item = { foo: 'bar' };

        const collection = collect([
            new Foo(),
            new TestClass(item),
            new Bar(),
            new Baz(),
        ]);

        const result = collection.whereInstanceOf(TestClass);
        
        expect(result.toArray()).toEqual([ new TestClass(item) ]);
    });

    test('retrieve collection zip', async () => {
        const result = number_collection_0.zip(obj_collection_2);

        expect(result.toArray()).toEqual([
            [ 1, { name: 'iPhone 10', brand: 'Apple', type: 'phone', released: 2018 } ],
            [ 2, { name: 'iPhone 9', brand: 'Apple', type: 'phone', released: 2017 } ],
            [ 3, { name: 'iPhone 8', brand: 'Apple', type: 'phone', released: 2016 } ],
            [ 4, null ],
            [ 5 , null],
        ]);
    });

    /* * * * */

    /**
     * @dummy
     */
    test.skip('retrieve collection dump', async () => {
        const result = obj_collection_1.dump();

        expect(result).toEqual(console.log(obj_collection_1.toArray()));
    });

});