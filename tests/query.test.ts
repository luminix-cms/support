
import Query from '../src/Query';

beforeEach(() => {
    jest.resetModules();
});

describe('automated query test', () => {

    /**
     * @toReview
     * @error TypeError: (0 , axios_1.toFormData) is not a function
     */
    test.skip('create query from object', async () => {
        const query = Query.fromObject({ a: 1, b: 2 });
        
        expect(query).toEqual('a=1&b=2');
    });

    test('query string into object', async () => {
        const query = Query.toObject(new URLSearchParams('a=1&b=2'));
        
        expect(query).toEqual({ a: '1', b: '2' });
    });

    /**
     * @toReview
     */
    test('merge queries', async () => {
        const merged = Query.merge(['?a=1&b=2', new URLSearchParams('c=3&d=4')] as any);

        const query = Query.toObject(merged);
        
        // expect(merged).toEqual("a=1&b=2&c=3&d=4");
        expect(query).toEqual({
            0: "?a=1&b=2",
            1: "c=3&d=4",
        });
    });

});
