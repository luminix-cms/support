
import Obj from '../src/Obj';

beforeEach(() => {
    jest.resetModules();
});

describe('automated object test', () => {

    test('get object value', async () => {

        const a = {
            user: { name: 'John Doe', age: 30 }, 
            posts: [
                { id: 1, title: 'Post 1', body: 'This is post 1' }, 
                { id: 2, title: 'Post 2', body: 'This is post 2' }
            ]
        };

        const obj_1 = Obj.get(a, 'user.name');
        const obj_2 = Obj.get(a, 'posts.1.title');

        expect(obj_1).toBe('John Doe');
        expect(obj_2).toBe('Post 2');
    });

    test('set object value', async () => {

        const a = {
            name: 'John Doe', 
            age: 30,
            email: 'john@example.com',
            password: 'password',
        };    

        Obj.set(a, 'name', 'Jane Doe');
        Obj.set(a, 'email', 'jane@example.com');

        expect(a).toMatchObject({
            name: 'Jane Doe',
            age: 30,
            email: 'jane@example.com',
            password: 'password',
        });
    });

    test('unset object value', async () => {

        const a = {
            name: 'John Doe', 
            age: 30,
            email: 'john@example.com',
            password: 'password',
        };    

        Obj.unset(a, 'password');

        expect(a).toMatchObject({
            name: 'John Doe',
            age: 30,
            email: 'john@example.com',
        });
    });

    test('has object by key', async () => {

        const a = {
            user: { name: 'John Doe', age: 30 }, 
            posts: [
                { id: 1, title: 'Post 1', body: 'This is post 1' }, 
                { id: 2, title: 'Post 2', body: 'This is post 2' }
            ]
        };

        const obj_1 = Obj.has(a, 'user.name');
        const obj_2 = Obj.has(a, 'posts.1.title');
        const obj_3 = Obj.has(a, 'posts.2.title');

        expect(obj_1).toBe(true);
        expect(obj_2).toBe(true);
        expect(obj_3).toBe(false);
    });

    test('object is empty', async () => {
        const obj = Obj.isEmpty({});

        expect(obj).toBe(true);
    });

    test('object is equal', async () => {

        const a = {
            name: 'John Doe', 
            age: 30, 
            email: 'john@example.com',
        };
        const b = {
            name: 'John Doe', 
            age: 30, 
            email: 'john@example.com',
        };
        const c = {
            name: 'Jane Doe', 
            age: 30, 
            email: 'jane@example.com',
        };

        const obj_1 = Obj.isEqual(a, b);
        const obj_2 = Obj.isEqual(a, c);

        expect(obj_1).toBe(true);
        expect(obj_2).toBe(false);
    });

    test('objects merge', async () => {

        const a = {
            user: { name: 'John Doe', age: 30 }, 
            posts: { 
                items: [
                    { id: 1, title: 'Post 1', body: 'This is post 1' }, 
                    { id: 2, title: 'Post 2', body: 'This is post 2' }
                ], 
                total: 2 
            } 
        };

        
        const obj = Obj.merge(a, { online: true });

        expect(obj).toMatchObject({ ...a, online: true });
    });

    test('objects omit item', async () => {

        const a = {
            user: { name: 'John Doe', age: 30 }, 
            posts: { 
                items: [
                    { id: 1, title: 'Post 1', body: 'This is post 1' }, 
                    { id: 2, title: 'Post 2', body: 'This is post 2' }
                ], 
                total: 2 
            } 
        };
        
        const obj_1 = Obj.omit(a, 'user.age');

        expect(obj_1).toMatchObject({ 
            user: { name: 'John Doe' }, 
            posts: { 
                items: [
                    { id: 1, title: 'Post 1', body: 'This is post 1' }, 
                    { id: 2, title: 'Post 2', body: 'This is post 2' }
                ], 
                total: 2 
            } 
        });

        const obj_2 = Obj.omit(a, 'posts.items.1');

        expect(obj_2).toMatchObject({ 
            user: { name: 'John Doe', age: 30 }, 
            posts: { 
                items: [{ id: 1, title: 'Post 1', body: 'This is post 1' }], 
                total: 2 
            } 
        });
    });

    test('objects pick item', async () => {      

        const a = {
            user: { name: 'John Doe', age: 30 }, 
            posts: [
                { id: 1, title: 'Post 1', body: 'This is post 1' }, 
                { id: 2, title: 'Post 2', body: 'This is post 2' }
            ]
        };

        const obj = Obj.pick(a, 'user.name', 'posts.1.id' );

        expect(obj).toMatchObject({
            user: { name: 'John Doe' },
            posts: [undefined, { id: 2 }]
        });
    });

    test('convert query string into object', async () => {
        const obj = Obj.fromQuery(new URLSearchParams({ 'user.name': 'John Doe' }));

        expect(obj).toMatchObject({ user: { name: 'John Doe' } });
    });

    /**
     * @toReview
     */
    test.skip('convert form data into object', async () => {

        // const form = new HTMLFormElement();

        // form.append('user.name', 'John Doe');
        // form.append('posts.items.0.title', 'Post 1');
        // form.append('posts.items.1.title', 'Post 2');
        // form.append('posts.items.2.title', 'Post 3');

        const form = {
            name: 'John Doe',
            age: 30,
            email: 'john@example.com',
            password: 'password',
        } as unknown as HTMLFormElement;

        const obj = Obj.fromFormData(new FormData(form as unknown as HTMLFormElement));

        expect(obj).toMatchObject({
            name: 'John Doe',
            age: 30,
            email: 'john@example.com',
            password: 'password',
        });
    });

    /**
     * @toReview
     */
    test.skip('object to query', async () => {
        
        const a = {
            name: 'John Doe',
            age: 30,
            email: 'john@example.com',
        };
        
        const obj = Obj.toQuery(a);

        expect(obj).toEqual("name=John%20Doe&age=30&email=john%40example.com");
    });

    /**
     * @toReview
     */
    test.skip('object to form data', async () => {    
        
        const a = {
            name: 'John Doe',
            age: 30,
            email: 'john@example.com',
        };
        
        const obj = Obj.toFormData(a);

        expect(obj).toMatchObject(new FormData(a as unknown as HTMLFormElement));
    });

});
