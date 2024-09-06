
import { AxiosRequestConfig } from 'axios';
import * as Obj from '../Obj';
import Request from './Request';


export type RequestOptions = Omit<AxiosRequestConfig, 'url' | 'method'>;


export default class Client {

    constructor(
        protected options: AxiosRequestConfig = {}
    ) {}

    private parseData(data?: object) {
        if (Obj.get(this.options, 'headers[Content-Type]', 'application/json') === 'application/x-www-form-urlencoded' && data) {
            return Obj.toFormData(data || {});
        }

        return data;
    }

    baseUrl(baseUrl: string): this {
        Obj.set(this.options, 'baseURL', baseUrl);

        return this;
    }

    asForm(): this {
        Obj.set(this.options, 'headers[Content-Type]', 'application/x-www-form-urlencoded');

        return this;
    }

    accept(type: string): this {
        Obj.set(this.options, 'headers[Accept]', type);

        return this;
    }

    acceptJson(): this {
        return this.accept('application/json');
    }

    withHeaders(headers: Record<string, string>): this {
        Obj.set(this.options, 'headers', Obj.merge(this.options.headers, headers));

        return this;
    }

    replaceHeaders(headers: Record<string, string>): this {
        Obj.set(this.options, 'headers', headers);

        return this;
    }

    withOptions(options: RequestOptions): this {
        this.options = Obj.merge(this.options, options);

        return this;
    }

    replaceOptions(options: RequestOptions): this {
        this.options = options;

        return this;
    }

    withQueryParameters(params: string | object): this {
        Obj.set(this.options, 'params', Obj.merge(this.options.params, params));

        return this;
    }

    replaceQueryParameters(params: string | object): this {
        Obj.set(this.options, 'params', params);

        return this;
    }

    withData(data: object): this {
        const rawCurrentData = Obj.get(this.options, 'data', {});
        const currentData = rawCurrentData instanceof FormData
            ? Obj.fromFormData(rawCurrentData)
            : rawCurrentData;
        
        Obj.set(this.options, 'data', this.parseData(Obj.merge(currentData, data)));

        return this;
    }

    replaceData(data: object): this {
        Obj.set(this.options, 'data', this.parseData(data));

        return this;
    }

    withBasicAuth(username: string, password: string): this {
        Obj.set(this.options, 'headers.Authorization', `Basic ${btoa(`${username}:${password}`)}`);

        return this;
    }

    withToken(token: string): this {
        Obj.set(this.options, 'headers.Authorization', `Bearer ${token}`);

        return this;
    }

    get<TResponse = any>(url: string, query?: string | object) {
        return new Request<TResponse>({
            ...this.options,
            params: query ?? this.options.params,
            url,
        });
    }

    post<TResponse = any, TData = any>(url: string, data?: TData) {
        return new Request<TResponse, TData>({
            ...this.options,
            method: 'post',
            url,
            data: this.parseData(data ?? this.options.data),
        });
    }

    put<TResponse = any, TData = any>(url: string, data?: TData) {
        return new Request<TResponse, TData>({
            ...this.options,
            method: 'put',
            url,
            data: this.parseData(data ?? this.options.data),
        });
    }

    patch<TResponse = any, TData = any>(url: string, data?: TData) {
        return new Request<TResponse, TData>({
            ...this.options,
            method: 'patch',
            url,
            data: this.parseData(data ?? this.options.data),
        });
    }

    delete<TResponse = any>(url: string, query?: string | object) {
        return new Request<TResponse>({
            ...this.options,
            method: 'delete',
            params: query ?? this.options.params,
            url,
        });
    }

};

