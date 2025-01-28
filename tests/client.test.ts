
import { uniqueId } from 'lodash-es';

import Client from '../src/Http/Client';
import isValidationError from '../src/Http/Utils/isValidationError';

import mockAxios, { AxiosError, AxiosHeaders } from 'axios';

beforeEach(() => {
    jest.resetModules();
});

describe('automated http client test', () => {

    test('make client and change url before request', async () => {

        (mockAxios as any).mockClear();
        (mockAxios as any).mockImplementationOnce(() => Promise.resolve({ 
            data: { 
                post: { id: 1, text: 'lorem ipsum' }, 
                message: 'post found' 
            },
            status: 200,
        }));

        const client = new Client();

        client.baseUrl('http://test.com');

        const response = await client.get('/test-get', { id: 1 });

        expect(mockAxios).toHaveBeenCalledTimes(1);
        expect(mockAxios).toHaveBeenCalledWith({
            baseURL: 'http://test.com',
            url: '/test-get',
            params: { id: 1 }
        });

        expect(response.successful()).toBe(true);
    });

    /**
     * @toReview
     * @error TypeError: (0 , axios_1.toFormData) is not a function
     */
    test.skip('make client form request', async () => {

        (mockAxios as any).mockClear();
        (mockAxios as any).mockImplementationOnce(() => Promise.resolve({ 
            data: { 
                post: { text: 'lorem ipsum' }, 
                message: 'post created' 
            },
            status: 200,
        }));

        const client = new Client();

        client.asForm();

        const response = await client.post('/test-post', { id: 2 });

        expect(mockAxios).toHaveBeenCalledTimes(1);
        expect(mockAxios).toHaveBeenCalledWith({
            url: '/test-post',
            method: 'post',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: { id: 2 }
        });

        expect(response.successful()).toBe(true);
    });

    test("make client which 'accept' is custom", async () => {

        (mockAxios as any).mockClear();
        (mockAxios as any).mockImplementationOnce(() => Promise.resolve({ 
            data: { 
                post: { text: 'lorem ipsum' }, 
                message: 'post created' 
            },
            status: 200,
        }));

        const client = new Client();

        client.accept('*/*');

        const response = await client.post('/test-post', { id: 2 });

        expect(mockAxios).toHaveBeenCalledTimes(1);
        expect(mockAxios).toHaveBeenCalledWith({
            url: '/test-post',
            method: 'post',
            headers: { 'Accept': '*/*' },
            data: { id: 2 }
        });

        expect(response.successful()).toBe(true);
    });

    test("make client which 'accept' is json", async () => {

        (mockAxios as any).mockClear();
        (mockAxios as any).mockImplementationOnce(() => Promise.resolve({ 
            data: { 
                post: { text: 'lorem ipsum' }, 
                message: 'post created' 
            },
            status: 200,
        }));

        const client = new Client();

        client.acceptJson();

        const response = await client.post('/test-post', { id: 2 });

        expect(mockAxios).toHaveBeenCalledTimes(1);
        expect(mockAxios).toHaveBeenCalledWith({
            url: '/test-post',
            method: 'post',
            headers: { 'Accept': 'application/json' },
            data: { id: 2 }
        });

        expect(response.successful()).toBe(true);
    });

    /**
     * @toReview
     */
    test.skip("make client with custom headers", async () => {

        (mockAxios as any).mockClear();
        (mockAxios as any).mockImplementationOnce(() => Promise.resolve({ 
            data: { 
                post: { text: 'lorem ipsum' }, 
                message: 'post created' 
            },
            status: 200,
        }));

        const client = new Client();

        client.withHeaders({
            'Accept': 'application/json', 
            'Content-Type': 'application/x-www-form-urlencoded', 
        });

        const response = await client.post('/test-post', { id: 2 });

        expect(mockAxios).toHaveBeenCalledTimes(1);
        expect(mockAxios).toHaveBeenCalledWith({
            url: '/test-post',
            method: 'post',
            headers: { 
                'Accept': 'application/json', 
                'Content-Type': 'application/x-www-form-urlencoded', 
            },
            data: { id: 2 }
        });

        expect(response.successful()).toBe(true);
    });

    test("make client with replaced custom headers", async () => {

        (mockAxios as any).mockClear();
        (mockAxios as any).mockImplementationOnce(() => Promise.resolve({ 
            data: { 
                post: { text: 'lorem ipsum' }, 
                message: 'post created' 
            },
            status: 200,
        }));

        const client = new Client();

        client.withHeaders({
            'Accept': 'application/json', 
            'Content-Type': 'application/x-www-form-urlencoded', 
        });

        client.replaceHeaders({
            'lorem': 'ipsum',
        });

        const response = await client.post('/test-post', { id: 2 });

        expect(mockAxios).toHaveBeenCalledTimes(1);
        expect(mockAxios).toHaveBeenCalledWith({
            url: '/test-post',
            method: 'post',
            headers: { 
                'lorem': 'ipsum', 
            }, 
            data: { id: 2 }
        });

        expect(response.successful()).toBe(true);
    });

    /**
     * @toReview
     * @error TypeError: (0 , axios_1.toFormData) is not a function
     */
    test.skip("make client with custom options", async () => {

        (mockAxios as any).mockClear();
        (mockAxios as any).mockImplementationOnce(() => Promise.resolve({ 
            data: { 
                post: { text: 'lorem ipsum' }, 
                message: 'post created' 
            },
            status: 200,
        }));

        const client = new Client();

        client.withOptions({
            baseURL: 'http://test.com',
            headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/x-www-form-urlencoded', 
            }, 
            data: { id: 2 }
        });

        const response = await client.post('/test-post', { id: 2 });

        expect(mockAxios).toHaveBeenCalledTimes(1);
        expect(mockAxios).toHaveBeenCalledWith({
            baseURL: 'http://test.com',
            url: '/test-post',
            method: 'post',
            headers: { 
                'Accept': 'application/json', 
                'Content-Type': 'application/x-www-form-urlencoded', 
            },
            data: { id: 2 }
        });

        expect(response.successful()).toBe(true);
    });

    test("make client with replaced custom options", async () => {

        (mockAxios as any).mockClear();
        (mockAxios as any).mockImplementationOnce(() => Promise.resolve({ 
            data: { 
                post: { text: 'lorem ipsum' }, 
                message: 'post created' 
            },
            status: 200,
        }));

        const client = new Client();

        const options = {
            baseURL: 'http://test.com',
            headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/x-www-form-urlencoded', 
            }, 
            data: { id: 2 }
        };

        client.withOptions(options);

        client.replaceOptions({
            ...options,
            headers: {
                'lorem': 'ipsum',
            }
        });

        const response = await client.post('/test-post', { id: 2 });

        expect(mockAxios).toHaveBeenCalledTimes(1);
        expect(mockAxios).toHaveBeenCalledWith({
            baseURL: 'http://test.com',
            url: '/test-post',
            method: 'post',
            headers: { 
                'lorem': 'ipsum',
            },
            data: { id: 2 }
        });

        expect(response.successful()).toBe(true);
    });

    test("make client with query parameters", async () => {

        (mockAxios as any).mockClear();
        (mockAxios as any).mockImplementationOnce(() => Promise.resolve({ 
            data: { 
                post: { id: 1 }, 
                message: 'post found' 
            },
            status: 200,
        }));

        const client = new Client();

        client.withQueryParameters(new URLSearchParams({ id: '1' }));

        const response = await client.get('/test-get');

        expect(mockAxios).toHaveBeenCalledTimes(1);
        expect(mockAxios).toHaveBeenCalledWith({
            url: '/test-get',
            params: { id: '1' }
        });

        expect(response.successful()).toBe(true);
    });

    test("make client with replaced query parameters", async () => {

        (mockAxios as any).mockClear();
        (mockAxios as any).mockImplementationOnce(() => Promise.resolve({ 
            data: { 
                post: { id: 2 }, 
                message: 'post found' 
            },
            status: 200,
        }));

        const client = new Client();

        client.withQueryParameters(new URLSearchParams({ id: '1' }));

        client.replaceQueryParameters(new URLSearchParams({ id: '2' }));

        const response = await client.get('/test-get');

        expect(mockAxios).toHaveBeenCalledTimes(1);
        expect(mockAxios).toHaveBeenCalledWith({
            url: '/test-get',
            params: { id: '2' }
        });

        expect(response.successful()).toBe(true);
    });

    test('make client with custom data', async () => {

        (mockAxios as any).mockClear();
        (mockAxios as any).mockImplementationOnce(() => Promise.resolve({ 
            data: { 
                user: { id: 2, name: 'test 2' }, 
                message: 'user created' 
            },
            status: 200,
        }));

        const client = new Client();

        client.withOptions({ data: { name: 'test' } });

        client.withData({ name: 'test', surname: '2' });

        const response = await client.post('/test-post');

        expect(mockAxios).toHaveBeenCalledTimes(1);
        expect(mockAxios).toHaveBeenCalledWith({
            url: '/test-post',
            method: 'post',
            data: { name: 'test', surname: '2' }
        });

        expect(response.successful()).toBe(true);
    });

    test('make client with replaced custom data', async () => {

        (mockAxios as any).mockClear();
        (mockAxios as any).mockImplementationOnce(() => Promise.resolve({ 
            data: { 
                user: { id: 2, name: 'test 2' }, 
                message: 'user created' 
            },
            status: 200,
        }));

        const client = new Client();

        client.withOptions({ data: { name: 'test' } });

        client.withData({ name: 'test', surname: '2' });

        client.replaceData({ name: 'test 2', surname: 'tested', height: 1.65 });

        const response = await client.post('/test-post');

        expect(mockAxios).toHaveBeenCalledTimes(1);
        expect(mockAxios).toHaveBeenCalledWith({
            url: '/test-post',
            method: 'post',
            data: { name: 'test 2', surname: 'tested', height: 1.65 }
        });

        expect(response.successful()).toBe(true);
    });

    test('make client with basic auth', async () => {

        (mockAxios as any).mockClear();
        (mockAxios as any).mockImplementationOnce(() => Promise.resolve({ 
            data: { 
                user: { id: 2, name: 'test 2' }, 
                message: 'user created' 
            },
            status: 200,
        }));

        const credentials = {
            username: 'test',
            password: '1234'
        };

        const token = btoa(`${credentials.username}:${credentials.password}`);

        const client = new Client();

        client.withBasicAuth(credentials.username, credentials.password);

        const response = await client.post('/test-post', { 
            username: credentials.username, 
            password: credentials.password 
        });

        expect(mockAxios).toHaveBeenCalledTimes(1);
        expect(mockAxios).toHaveBeenCalledWith({
            url: '/test-post',
            method: 'post',
            headers: {
                'Authorization': `Basic ${token}`,
            },
            data: { 
                username: credentials.username, 
                password: credentials.password 
            }
        });

        expect(response.successful()).toBe(true);
    });

    test('make client with auth token', async () => {

        (mockAxios as any).mockClear();
        (mockAxios as any).mockImplementationOnce(() => Promise.resolve({ 
            data: { 
                user: { id: 2, name: 'test 2' }, 
                message: 'user created' 
            },
            status: 200,
        }));

        const credentials = {
            username: 'test',
            password: '1234'
        };

        const token = uniqueId();

        const client = new Client();

        client.withToken(token);

        const response = await client.post('/test-post', { 
            username: credentials.username, 
            password: credentials.password 
        });

        expect(mockAxios).toHaveBeenCalledTimes(1);
        expect(mockAxios).toHaveBeenCalledWith({
            url: '/test-post',
            method: 'post',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            data: { 
                username: credentials.username, 
                password: credentials.password 
            }
        });

        expect(response.successful()).toBe(true);
    });

    test("make client 'get' request", async () => {

        (mockAxios as any).mockClear();
        (mockAxios as any).mockImplementationOnce(() => Promise.resolve({ 
            data: { 
                user: { id: 1, name: 'test 1' }, 
                message: 'user found' 
            },
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
        expect(response.json('message')).toBe('user found');
        expect(response.json('user.id')).toBe(1);
        expect(response.json('user.name')).toBe('test 1');
    });

    test("make client 'post' request", async () => {

        (mockAxios as any).mockClear();
        (mockAxios as any).mockImplementationOnce(() => Promise.resolve({ 
            data: { 
                user: { id: 2, name: 'test 2' }, 
                message: 'user created' 
            },
            status: 200,
        }));

        const client = new Client();
        const response = await client.post('/test-post', { name: 'test 2' });

        expect(mockAxios).toHaveBeenCalledTimes(1);
        expect(mockAxios).toHaveBeenCalledWith({
            url: '/test-post',
            method: 'post',
            data: { name: 'test 2' }
        });

        expect(response.successful()).toBe(true);
        expect(response.json('message')).toBe('user created');
        expect(response.json('user.id')).toBe(2);
    });

    test("make client 'post' request validation", async () => {

        (mockAxios as any).mockClear();
        (mockAxios as any).mockImplementationOnce(() => Promise.resolve({ 
            data: { 
                user: { id: 3, name: 'test 4' }, 
                message: 'user created' 
            },
            status: 200,
        }));

        const client = new Client();
        const response = await client.post('/test-post', { name: 'test 4' });

        expect(mockAxios).toHaveBeenCalledTimes(1);

        expect(response.unprocessableEntity()).toBe(false);
        expect(response.json('message')).toBe('user created');
        expect(isValidationError(response)).toBe(false);
    });

    test("make client 'post' request validation error", async () => {

        (mockAxios as any).mockClear();
        (mockAxios as any).mockImplementationOnce(() => Promise.resolve({
            data: {
                message: 'bad request',
                errors: {
                    name: ['Unprocessable Entity']
                },
            },
            status: 422
        }));

        const client = new Client();
        const response = await client.post('/test-post', { name: 'test 4' });

        expect(mockAxios).toHaveBeenCalledTimes(1);

        expect(response.unprocessableEntity()).toBe(true);
        expect(response.json('message')).toBe('bad request');        
        expect(isValidationError(response)).toBe(true);
    });

    test("make client 'put' request", async () => {

        (mockAxios as any).mockClear();
        (mockAxios as any).mockImplementationOnce(() => Promise.resolve({ 
            data: { 
                user: { id: 2, name: 'test 3' }, 
                message: 'user updated' 
            },
            status: 200,
        }));

        const client = new Client();
        const response = await client.put('/test-put', { id: 2, name: 'test 3' });

        expect(mockAxios).toHaveBeenCalledTimes(1);
        expect(mockAxios).toHaveBeenCalledWith({
            url: '/test-put',
            method: 'put',
            data: { id: 2, name: 'test 3' }
        });

        expect(response.successful()).toBe(true);
        expect(response.json('message')).toBe('user updated');
        expect(response.json('user.id')).toBe(2);
        expect(response.json('user.name')).toBe('test 3');
    });

    test("make client 'patch' request", async () => {

        (mockAxios as any).mockClear();
        (mockAxios as any).mockImplementationOnce(() => Promise.resolve({ 
            data: { 
                user: { id: 2, name: 'test 3' }, 
                message: 'user updated' 
            },
            status: 200,
        }));

        const client = new Client();
        const response = await client.patch('/test-patch', { id: 2, name: 'test 3' });

        expect(mockAxios).toHaveBeenCalledTimes(1);
        expect(mockAxios).toHaveBeenCalledWith({
            url: '/test-patch',
            method: 'patch',
            data: { id: 2, name: 'test 3' }
        });

        expect(response.successful()).toBe(true);
        expect(response.json('message')).toBe('user updated');
        expect(response.json('user.id')).toBe(2);
        expect(response.json('user.name')).toBe('test 3');
    });

    test("make client 'delete' request", async () => {

        (mockAxios as any).mockClear();
        (mockAxios as any).mockImplementationOnce(() => Promise.resolve({ 
            data: { 
                user: null, 
                message: 'user deleted' 
            },
            status: 200,
        }));

        const client = new Client();
        const response = await client.delete('/test-delete', { id: 1 });

        expect(mockAxios).toHaveBeenCalledTimes(1);
        expect(mockAxios).toHaveBeenCalledWith({
            url: '/test-delete',
            method: 'delete',
            params: { id: 1 }
        });

        expect(response.successful()).toBe(true);
        expect(response.json('message')).toBe('user deleted');
        expect(response.json('user')).toBeNull();
    });

    test("client 'get' request with error", async () => {
        
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

});