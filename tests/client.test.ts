import Client from '../src/Http/Client';
import mockAxios, { AxiosError, AxiosHeaders } from 'axios';

describe('testing http client', () => {

    test('reviewed create client get request', async () => {

        (mockAxios as any).mockClear();
        (mockAxios as any).mockImplementationOnce(() => Promise.resolve({ 
            data: { user: { id: 1, name: 'test 1' }, status: 'received' },
            status: 200,
        }));

        const client = new Client();
        const response = await client.get('/test-get', { id: 1 });

        expect(mockAxios).toHaveBeenCalledTimes(1);
        expect(mockAxios).toHaveBeenCalledWith({
            url: '/test-get',
            params: { id: 1 }
        });

        expect(response.successful()).toBe(true);
        expect(response.json('status')).toBe('received');
        expect(response.json('user.id')).toBe(1);


    });

    test('client get request with error', async () => {
        
        (mockAxios as any).mockClear();
        (mockAxios as any).mockImplementationOnce(() => Promise.reject(new AxiosError(
            'error message',
            '500',
            undefined,
            undefined,
            { 
                data: { error: 'error message' },
                status: 500,
                statusText: 'Internal Server Error',
                headers: {},
                config: {
                    headers: new AxiosHeaders(),
                },
            },
        )));

        const client = new Client();
        const response = await client.get('/test-get', { id: 1 });

        expect(mockAxios).toHaveBeenCalledTimes(1);
        expect(mockAxios).toHaveBeenCalledWith({
            url: '/test-get',
            params: { id: 1 }
        });

        expect(response.successful()).toBe(false);
        expect(response.json('error')).toBe('error message');
        expect(response.status()).toBe(500);
        expect(response.serverError()).toBe(true);
        expect(() => response.throw()).toThrow('error message');

    });

    // test('create client post request', async () => {
    //     const testApp = new TestApp();

    //     testApp.singleton('http', () => new Client());

    //     const http = testApp.make('http');

    //     const request: Request = http.post('/test-post', { id: 2, name: 'test 2' });

    //     const resolve = await mockAxios.post(request);

    //     expect(resolve.status).toBe('created');
    //     expect(resolve.data).toMatchObject({ user: { id: 2, name: 'test 2' }});
    // });

    // test('create client put request', async () => {
    //     const testApp = new TestApp();

    //     testApp.singleton('http', () => new Client());

    //     const http = testApp.make('http');

    //     const request: Request = http.put('/test-put', { id: 2, name: 'test 3' });

    //     const resolve = await mockAxios.put(request);

    //     expect(resolve.status).toBe('updated');
    //     expect(resolve.data).toMatchObject({ user: { id: 2, name: 'test 3' }});
    // });

    // test('create client delete request', async () => {
    //     const testApp = new TestApp();

    //     testApp.singleton('http', () => new Client());

    //     const http = testApp.make('http');

    //     const request: Request = http.delete('/test-delete', { id: 1 });

    //     const resolve = await mockAxios.delete(request);

    //     expect(resolve.status).toBe('deleted');
    //     expect(resolve.data).toMatchObject({ });
    // });

});