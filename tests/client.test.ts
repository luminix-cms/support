
import Application from '../src/App/Application';
import Client from '../src/Http/Client';

import mockAxios from './__mocks__/axios';

class TestApp extends Application {

    foo() {
        return this.bar();
    }

    bar() {
        return 1;
    }

}

describe('testing http client', () => {

    test('create client get request', async () => {
        const testApp = new TestApp();

        testApp.singleton('http', () => new Client());

        const http = testApp.make('http');

        const request: Request = http.get('/test-get', { id: 1 });

        const resolve = await mockAxios.get(request);

        expect(resolve.status).toBe('received');
        expect(resolve.data).toMatchObject({ user: { id: 1, name: 'test 1' }});
    });

    test('create client post request', async () => {
        const testApp = new TestApp();

        testApp.singleton('http', () => new Client());

        const http = testApp.make('http');

        const request: Request = http.post('/test-post', { id: 2, name: 'test 2' });

        const resolve = await mockAxios.post(request);

        expect(resolve.status).toBe('created');
        expect(resolve.data).toMatchObject({ user: { id: 2, name: 'test 2' }});
    });

    test('create client put request', async () => {
        const testApp = new TestApp();

        testApp.singleton('http', () => new Client());

        const http = testApp.make('http');

        const request: Request = http.put('/test-put', { id: 2, name: 'test 3' });

        const resolve = await mockAxios.put(request);

        expect(resolve.status).toBe('updated');
        expect(resolve.data).toMatchObject({ user: { id: 2, name: 'test 3' }});
    });

    test('create client delete request', async () => {
        const testApp = new TestApp();

        testApp.singleton('http', () => new Client());

        const http = testApp.make('http');

        const request: Request = http.delete('/test-delete', { id: 1 });

        const resolve = await mockAxios.delete(request);

        expect(resolve.status).toBe('deleted');
        expect(resolve.data).toMatchObject({ });
    });

});