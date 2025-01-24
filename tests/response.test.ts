
import Client from '../src/Http/Client';

import mockAxios, { AxiosError, AxiosHeaders } from 'axios';

describe('automated http response test', () => {

    test('make client request response body', async () => {

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

        expect(response.successful()).toBe(true);
        expect(response.body()).toBe('{"user":{"id":1,"name":"test 1"},"message":"user found"}');
    });

    test('make client request response json', async () => {

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

        expect(response.successful()).toBe(true);
        expect(response.json()).toEqual({ 
            user: { id: 1, name: 'test 1' }, 
            message: 'user found' 
        });
    });

    test('make client request response json has key', async () => {

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

        expect(response.successful()).toBe(true);
        expect(response.has('user')).toBe(true);
        expect(response.has('user.id')).toBe(true);
        expect(response.has('user.name')).toBe(true);
        expect(response.has('message')).toBe(true);
    });

    test('make client request response status', async () => {

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

        expect(response.successful()).toBe(true);
        expect(response.status()).toBe(200);
    });

    test("make client request response 'ok' status", async () => {

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

        expect(response.successful()).toBe(true);
        expect(response.ok()).toBe(true);
    });

    test("make client request response 'created' status", async () => {

        (mockAxios as any).mockClear();
        (mockAxios as any).mockImplementationOnce(() => Promise.resolve({ 
            data: { 
                user: { id: 1, name: 'test 1' }, 
                message: 'user found' 
            },
            status: 201,
        }));

        const client = new Client();
        const response = await client.get('/test-get', { id: 1 });

        expect(mockAxios).toHaveBeenCalledTimes(1);

        expect(response.successful()).toBe(true);
        expect(response.created()).toBe(true);
    });

    test("make client request response 'accepted' status", async () => {

        (mockAxios as any).mockClear();
        (mockAxios as any).mockImplementationOnce(() => Promise.resolve({ 
            data: { 
                user: { id: 1, name: 'test 1' }, 
                message: 'user found' 
            },
            status: 202,
        }));

        const client = new Client();
        const response = await client.get('/test-get', { id: 1 });

        expect(mockAxios).toHaveBeenCalledTimes(1);

        expect(response.successful()).toBe(true);
        expect(response.accepted()).toBe(true);
    });

    test("make client request response 'no content' status", async () => {

        (mockAxios as any).mockClear();
        (mockAxios as any).mockImplementationOnce(() => Promise.resolve({ 
            data: { 
                user: { id: 1, name: 'test 1' }, 
                message: 'user found' 
            },
            status: 204,
        }));

        const client = new Client();
        const response = await client.get('/test-get', { id: 1 });

        expect(mockAxios).toHaveBeenCalledTimes(1);

        expect(response.successful()).toBe(true);
        expect(response.noContent()).toBe(true);
    });

    test("make client request response 'moved permanently' status", async () => {

        (mockAxios as any).mockClear();
        (mockAxios as any).mockImplementationOnce(() => Promise.resolve({ 
            data: { 
                user: { id: 1, name: 'test 1' }, 
                message: 'user found' 
            },
            status: 301,
        }));

        const client = new Client();
        const response = await client.get('/test-get', { id: 1 });

        expect(mockAxios).toHaveBeenCalledTimes(1);

        expect(response.successful()).toBe(false);
        expect(response.redirect()).toBe(true);
        expect(response.movedPermanently()).toBe(true);
    });

    test("make client request response 'found' status", async () => {

        (mockAxios as any).mockClear();
        (mockAxios as any).mockImplementationOnce(() => Promise.resolve({ 
            data: { 
                user: { id: 1, name: 'test 1' }, 
                message: 'user found' 
            },
            status: 302,
        }));

        const client = new Client();
        const response = await client.get('/test-get', { id: 1 });

        expect(mockAxios).toHaveBeenCalledTimes(1);

        expect(response.successful()).toBe(false);
        expect(response.redirect()).toBe(true);
        expect(response.found()).toBe(true);
    });

    test("make client request response 'bad request' status", async () => {

        (mockAxios as any).mockClear();
        (mockAxios as any).mockImplementationOnce(() => Promise.resolve({ 
            data: { 
                user: { id: 1, name: 'test 1' }, 
                message: 'user found' 
            },
            status: 400,
        }));

        const client = new Client();
        const response = await client.get('/test-get', { id: 1 });

        expect(mockAxios).toHaveBeenCalledTimes(1);

        expect(response.successful()).toBe(false);
        expect(response.clientError()).toBe(true);
        expect(response.badRequest()).toBe(true);
    });

    test("make client request response 'unauthorized' status", async () => {

        (mockAxios as any).mockClear();
        (mockAxios as any).mockImplementationOnce(() => Promise.resolve({ 
            data: { 
                user: { id: 1, name: 'test 1' }, 
                message: 'user found' 
            },
            status: 401,
        }));

        const client = new Client();
        const response = await client.get('/test-get', { id: 1 });

        expect(mockAxios).toHaveBeenCalledTimes(1);

        expect(response.successful()).toBe(false);
        expect(response.clientError()).toBe(true);
        expect(response.unauthorized()).toBe(true);
    });

    test("make client request response 'payment required' status", async () => {

        (mockAxios as any).mockClear();
        (mockAxios as any).mockImplementationOnce(() => Promise.resolve({ 
            data: { 
                user: { id: 1, name: 'test 1' }, 
                message: 'user found' 
            },
            status: 402,
        }));

        const client = new Client();
        const response = await client.get('/test-get', { id: 1 });

        expect(mockAxios).toHaveBeenCalledTimes(1);

        expect(response.successful()).toBe(false);
        expect(response.clientError()).toBe(true);
        expect(response.paymentRequired()).toBe(true);
    });

    test("make client request response 'forbidden' status", async () => {

        (mockAxios as any).mockClear();
        (mockAxios as any).mockImplementationOnce(() => Promise.resolve({ 
            data: { 
                user: { id: 1, name: 'test 1' }, 
                message: 'user found' 
            },
            status: 403,
        }));

        const client = new Client();
        const response = await client.get('/test-get', { id: 1 });

        expect(mockAxios).toHaveBeenCalledTimes(1);

        expect(response.successful()).toBe(false);
        expect(response.clientError()).toBe(true);
        expect(response.forbidden()).toBe(true);
    });

    test("make client request response 'not found' status", async () => {

        (mockAxios as any).mockClear();
        (mockAxios as any).mockImplementationOnce(() => Promise.resolve({ 
            data: { 
                user: { id: 1, name: 'test 1' }, 
                message: 'user found' 
            },
            status: 404,
        }));

        const client = new Client();
        const response = await client.get('/test-get', { id: 1 });

        expect(mockAxios).toHaveBeenCalledTimes(1);

        expect(response.successful()).toBe(false);
        expect(response.clientError()).toBe(true);
        expect(response.notFound()).toBe(true);
    });

    test("make client request response 'request timeout' status", async () => {

        (mockAxios as any).mockClear();
        (mockAxios as any).mockImplementationOnce(() => Promise.resolve({ 
            data: { 
                user: { id: 1, name: 'test 1' }, 
                message: 'user found' 
            },
            status: 408,
        }));

        const client = new Client();
        const response = await client.get('/test-get', { id: 1 });

        expect(mockAxios).toHaveBeenCalledTimes(1);

        expect(response.successful()).toBe(false);
        expect(response.clientError()).toBe(true);
        expect(response.requestTimeout()).toBe(true);
    });

    test("make client request response 'conflict' status", async () => {

        (mockAxios as any).mockClear();
        (mockAxios as any).mockImplementationOnce(() => Promise.resolve({ 
            data: { 
                user: { id: 1, name: 'test 1' }, 
                message: 'user found' 
            },
            status: 409,
        }));

        const client = new Client();
        const response = await client.get('/test-get', { id: 1 });

        expect(mockAxios).toHaveBeenCalledTimes(1);

        expect(response.successful()).toBe(false);
        expect(response.clientError()).toBe(true);
        expect(response.conflict()).toBe(true);
    });

    test("make client request response 'unprocessable entity' status", async () => {

        (mockAxios as any).mockClear();
        (mockAxios as any).mockImplementationOnce(() => Promise.resolve({ 
            data: { 
                user: { id: 1, name: 'test 1' }, 
                message: 'user found' 
            },
            status: 422,
        }));

        const client = new Client();
        const response = await client.get('/test-get', { id: 1 });

        expect(mockAxios).toHaveBeenCalledTimes(1);

        expect(response.successful()).toBe(false);
        expect(response.clientError()).toBe(true);
        expect(response.unprocessableEntity()).toBe(true);
    });

    test("make client request response 'too many requests' status", async () => {

        (mockAxios as any).mockClear();
        (mockAxios as any).mockImplementationOnce(() => Promise.resolve({ 
            data: { 
                user: { id: 1, name: 'test 1' }, 
                message: 'user found' 
            },
            status: 429,
        }));

        const client = new Client();
        const response = await client.get('/test-get', { id: 1 });

        expect(mockAxios).toHaveBeenCalledTimes(1);

        expect(response.successful()).toBe(false);
        expect(response.clientError()).toBe(true);
        expect(response.tooManyRequests()).toBe(true);
    });

    test('make client request response success status', async () => {

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

        expect(response.successful()).toBe(true);
        expect(response.status()).toBeGreaterThanOrEqual(200);
        expect(response.status()).toBeLessThanOrEqual(299);
    });

    test('make client request response not success status', async () => {

        (mockAxios as any).mockClear();
        (mockAxios as any).mockImplementationOnce(() => Promise.resolve({ 
            data: { 
                user: { id: 1, name: 'test 1' }, 
                message: 'user found' 
            },
            status: 301,
        }));

        const client = new Client();
        const response = await client.get('/test-get', { id: 1 });

        expect(mockAxios).toHaveBeenCalledTimes(1);

        expect(response.successful()).toBe(false);
        expect(response.status()).toBeGreaterThanOrEqual(300);
    });

    test('make client request response redirect', async () => {

        (mockAxios as any).mockClear();
        (mockAxios as any).mockImplementationOnce(() => Promise.resolve({ 
            data: { 
                user: { id: 1, name: 'test 1' }, 
                message: 'user found' 
            },
            status: 305,
        }));

        const client = new Client();
        const response = await client.get('/test-get', { id: 1 });

        expect(mockAxios).toHaveBeenCalledTimes(1);

        expect(response.successful()).toBe(false);
        expect(response.redirect()).toBe(true);
        expect(response.status()).toBeGreaterThanOrEqual(300);
        expect(response.status()).toBeLessThanOrEqual(399);
    });

    test('make client request response client side error', async () => {

        (mockAxios as any).mockClear();
        (mockAxios as any).mockImplementationOnce(() => Promise.resolve({ 
            data: { 
                user: { id: 1, name: 'test 1' }, 
                message: 'user found' 
            },
            status: 405,
        }));

        const client = new Client();
        const response = await client.get('/test-get', { id: 1 });

        expect(mockAxios).toHaveBeenCalledTimes(1);

        expect(response.successful()).toBe(false);
        expect(response.clientError()).toBe(true);
        expect(response.status()).toBeGreaterThanOrEqual(400);
        expect(response.status()).toBeLessThanOrEqual(499);
    });

    test('make client request response server side error', async () => {

        (mockAxios as any).mockClear();
        (mockAxios as any).mockImplementationOnce(() => Promise.resolve({ 
            data: { 
                user: { id: 1, name: 'test 1' }, 
                message: 'user found' 
            },
            status: 500,
        }));

        const client = new Client();
        const response = await client.get('/test-get', { id: 1 });

        expect(mockAxios).toHaveBeenCalledTimes(1);

        expect(response.successful()).toBe(false);
        expect(response.serverError()).toBe(true);
        expect(response.status()).toBeGreaterThanOrEqual(500);
    });

    test('make client request response server side error', async () => {

        (mockAxios as any).mockClear();
        (mockAxios as any).mockImplementationOnce(() => Promise.resolve({ 
            data: { 
                user: { id: 1, name: 'test 1' }, 
                message: 'user found' 
            },
            status: 422,
        }));

        const client = new Client();
        const response = await client.get('/test-get', { id: 1 });

        expect(mockAxios).toHaveBeenCalledTimes(1);

        expect(response.successful()).toBe(false);
        expect(response.failed()).toBe(true);
        expect(response.status()).toBeGreaterThanOrEqual(400);
    });

    test('make client request response has header', async () => {

        (mockAxios as any).mockClear();
        (mockAxios as any).mockImplementationOnce(() => Promise.resolve({ 
            headers: { 
                'Accept': 'application/json', 
            },
            data: { 
                user: { id: 1, name: 'test 1' }, 
                message: 'user found' 
            },
            status: 200,
        }));

        const client = new Client();
        const response = await client.post('/test-post', { id: 2 });

        expect(mockAxios).toHaveBeenCalledTimes(1);
        expect(mockAxios).toHaveBeenCalledWith({
            url: '/test-post',
            method: 'post',
            data: { id: 2 }
        });

        expect(response.successful()).toBe(true);
        expect(response.header('Accept')).toBe('application/json');
    });

    test('make client request response headers', async () => {

        (mockAxios as any).mockClear();
        (mockAxios as any).mockImplementationOnce(() => Promise.resolve({ 
            headers: { 
                'Accept': 'application/json', 
            },
            data: { 
                user: { id: 1, name: 'test 1' }, 
                message: 'user found' 
            },
            status: 200,
        }));

        const client = new Client();
        const response = await client.post('/test-post', { id: 2 });

        expect(mockAxios).toHaveBeenCalledTimes(1);
        expect(mockAxios).toHaveBeenCalledWith({
            url: '/test-post',
            method: 'post',
            data: { id: 2 }
        });

        expect(response.successful()).toBe(true);
        expect(response.headers()).toEqual({ 
            'Accept': 'application/json', 
        });
    });

    test('make client request response error', async () => {
        
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

        expect(response.successful()).toBe(false);
        expect(response.error()?.message).toBe('error message');
        expect(response.serverError()).toBe(true);
    });

    test('make client request response throw error if', async () => {
        
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
        expect(() => response.throwIf(
            () => response.serverError()
        )).toThrow('error message');
    });

    test('make client request response throw error unless', async () => {
        
        (mockAxios as any).mockClear();
        (mockAxios as any).mockImplementationOnce(() => Promise.reject(new AxiosError(
            'error message',
            '429',
            undefined,
            undefined,
            { 
                data: { error: 'error message', reason: 'timeout' },
                status: 429,
                statusText: 'Not Found',
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
        expect(() => response.throwUnless(response.json().reason === 'timeout')).not.toThrow('error message');     
        expect(() => response.throwUnless(
            () => ![ 'timeout' ].includes(response.json().reason)
        )).toThrow('error message');
    });

    test('make client request response throw error if status is', async () => {
        
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
        expect(() => response.throwIfStatus(
            () => response.serverError()
        )).toThrow('error message');
    });

    test('make client request response throw error unless status is', async () => {
        
        (mockAxios as any).mockClear();
        (mockAxios as any).mockImplementationOnce(() => Promise.reject(new AxiosError(
            'error message',
            '429',
            undefined,
            undefined,
            { 
                data: { error: 'error message', reason: 'timeout' },
                status: 429,
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

        expect(() => response.throwUnlessStatus(429)).not.toThrow('error message');        
        expect(() => response.throwUnlessStatus(
            () => !response.tooManyRequests()
        )).toThrow('error message');
    });

    test('make client request response throw if client error', async () => {
        
        (mockAxios as any).mockClear();
        (mockAxios as any).mockImplementationOnce(() => Promise.reject(new AxiosError(
            'client error',
            '404',
            undefined,
            undefined,
            { 
                data: { error: 'client error', reason: 'timeout' },
                status: 404,
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
        expect(response.clientError()).toBe(true);
        expect(() => response.throwIfClientError()).toThrow('client error');
    });

    test('make client request response throw if server error', async () => {
        
        (mockAxios as any).mockClear();
        (mockAxios as any).mockImplementationOnce(() => Promise.reject(new AxiosError(
            'server error',
            '500',
            undefined,
            undefined,
            { 
                data: { error: 'server error', reason: 'timeout' },
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
        expect(response.serverError()).toBe(true);
        expect(() => response.throwIfServerError()).toThrow('server error');
    });

});
