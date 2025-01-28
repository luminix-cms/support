
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
        // const path_2 = 'user.address';
        
        pb.lock(path_1);
        // pb.lock(path_2);

        expect(() => pb.set(path_1, 31)).toThrow(`Cannot set a locked path "${path_1}"`);
        expect(() => pb.delete(path_1)).toThrow(`Cannot delete a locked path "${path_1}"`);
        // expect(() => pb.set('user.location', address)).toThrow(`Cannot set a path "${path_2}" that would override a locked path`);
    });

});
