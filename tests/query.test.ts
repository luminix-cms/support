
import Query from '../src/Query';

beforeEach(() => {
    jest.resetModules();
});

describe('automated query test', () => {

    test('query URLSearchParams into object', () => {
        const query = Query.toObject(new URLSearchParams('a=1&b=2'));

        expect(query).toEqual({ a: '1', b: '2' });
    });

    test('merge two query strings into one URLSearchParams', () => {
        const merged = Query.merge('http://example.com?a=1&b=2', '?c=3&d=4');
        const obj = Query.toObject(merged);

        expect(obj).toEqual({ a: '1', b: '2', c: '3', d: '4' });
    });

    test('merge query string with URLSearchParams instance', () => {
        const merged = Query.merge('http://example.com?a=1', new URLSearchParams('b=2&c=3'));
        const obj = Query.toObject(merged);

        expect(obj).toEqual({ a: '1', b: '2', c: '3' });
    });

    test('merge strips leading ? from string parts', () => {
        const merged = Query.merge('?page=1', '?sort=name');
        const obj = Query.toObject(merged);

        expect(obj).toEqual({ page: '1', sort: 'name' });
    });

    test('merge with a later key overwrites an earlier one', () => {
        const merged = Query.merge('?page=1', '?page=2');
        const obj = Query.toObject(merged);

        expect(obj).toEqual({ page: '2' });
    });

    test('merge with no arguments returns empty URLSearchParams', () => {
        const merged = Query.merge();

        expect(merged.toString()).toBe('');
    });

});
