
import PropertyBag from '../src/PropertyBag';

beforeEach(() => {
    jest.resetModules();
});

export default function bag<T extends object>(items: T) {
    return new PropertyBag(items);
}

describe('automated property bag test', () => {

    test('has value in bag', async () => {

        const pb = bag({
            user: {
                name: 'John Doe', 
                age: 30,
            }
        });
        
        expect(pb.has('user.name')).toBe(true);
    });

    test('bag is empty', async () => {

        const pb_1 = bag({
            user: {
                name: 'John Doe', 
                age: 30,
            }
        });

        const pb_2 = bag({});
        
        expect(pb_1.isEmpty()).not.toBe(true);
        expect(pb_2.isEmpty()).toBe(true);
    });

    test('get all values from bag', async () => {

        const pb = bag({
            user: {
                name: 'John Doe', 
                age: 30,
            }
        });
        
        expect(pb.all()).toStrictEqual({
            user: {
                name: 'John Doe', 
                age: 30,
            }
        });
    });

    test('get value from bag', async () => {

        const pb = bag({
            user: {
                name: 'John Doe', 
                age: 30,
            }
        });
        
        expect(pb.get('user.name')).toBe('John Doe');
    });

    test('set value from bag', async () => {

        const pb = bag({
            user: {
                name: 'John Doe', 
                age: 30,
            }
        });

        const path_1 = 'user.age';
        const path_2 = '.';

        pb.set(path_1, 'Jane Doe');

        expect(pb.get(path_1)).toBe('Jane Doe');

        expect(() => pb.set(path_2, null)).toThrow('Value must be an object');
    });

    test('delete value from bag', async () => {

        const pb = bag({
            user: {
                name: 'John Doe', 
                age: 30,
            }
        });

        pb.delete('user.name');
        
        expect(pb.has('user.name')).toBe(false);
    });

    test('merge into bag value', async () => {

        const pb = bag({
            user: {
                name: 'John Doe', 
                age: 30,
            }
        });

        pb.merge('user', { location: 'HERE' });
        
        expect(pb.has('user.location')).toBe(true);
        expect(pb.get('user.location')).toBe('HERE');
    });

    test('clone bag', async () => {

        const pb = bag({
            user: {
                name: 'John Doe', 
                age: 30,
            }
        });

        const pb_clone = pb.clone();
        
        expect(pb_clone.all()).toStrictEqual(pb.all());
    });

    test('lock bag path then try to set it', async () => {

        const address = {
            street: '123 Main St',
            city: 'Anytown',
            state: 'AW',
            zip: '12345'
        };

        const pb = bag({
            user: {
                name: 'John Doe',
                age: 30,
                address,
            }
        });

        const path_1 = 'user.age';

        pb.lock(path_1);

        expect(() => pb.set(path_1, 31)).toThrow(`Cannot set a locked path "${path_1}"`);
        expect(() => pb.delete(path_1)).toThrow(`Cannot delete a locked path "${path_1}"`);
    });

    test('lock() throws when path does not exist', () => {
        const pb = bag({ user: { name: 'Alice' } });

        expect(() => pb.lock('user.missing')).toThrow('Cannot lock a non-existing path');
    });

    test('set(".") replaces the entire bag contents', () => {
        const pb = bag({ a: 1, b: 2 });

        pb.set('.', { c: 3 });

        expect(pb.all()).toEqual({ c: 3 });
        expect(pb.has('a')).toBe(false);
    });

    test('merge(".") merges keys at the root level', () => {
        const pb = bag({ a: 1, b: 2 });

        pb.merge('.', { c: 3 });

        expect(pb.all()).toEqual({ a: 1, b: 2, c: 3 });
    });

    test('clone() produces an independent copy', () => {
        const pb = bag({ user: { name: 'Alice' } });
        const copy = pb.clone();

        pb.set('user.name', 'Bob');

        expect(copy.get('user.name')).toBe('Alice');
        expect(pb.get('user.name')).toBe('Bob');
    });

    test('change event fires on set with correct metadata', () => {
        const pb = bag({ score: 0 });
        const handler = jest.fn();

        pb.on('change', handler);
        pb.set('score', 10);

        expect(handler).toHaveBeenCalledTimes(1);
        expect(handler).toHaveBeenCalledWith(
            expect.objectContaining({ path: 'score', value: 10, type: 'set' })
        );
    });

    test('change event fires on non-root merge (delegates to set internally)', () => {
        const pb = bag({ user: { name: 'Alice' } });
        const handler = jest.fn();

        pb.on('change', handler);
        pb.merge('user', { age: 30 });

        expect(handler).toHaveBeenCalledTimes(1);
        expect(handler).toHaveBeenCalledWith(
            expect.objectContaining({ path: 'user', type: 'set' })
        );
        expect(pb.get('user.name')).toBe('Alice');
        expect(pb.get('user.age')).toBe(30);
    });

    test('change event fires on root merge with type="merge"', () => {
        const pb = bag({ a: 1 });
        const handler = jest.fn();

        pb.on('change', handler);
        pb.merge('.', { b: 2 });

        expect(handler).toHaveBeenCalledWith(
            expect.objectContaining({ path: '.', type: 'merge' })
        );
    });

    test('change event fires on delete with type="delete"', () => {
        const pb = bag({ a: 1, b: 2 });
        const handler = jest.fn();

        pb.on('change', handler);
        pb.delete('a');

        expect(handler).toHaveBeenCalledWith(
            expect.objectContaining({ path: 'a', value: null, type: 'delete' })
        );
    });

});
