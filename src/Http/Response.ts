
import Obj from '../Obj';

import { AxiosResponse } from 'axios';

export default class Response<TResponse = any, TData = any> {

    constructor(
        protected _response: AxiosResponse<TResponse, TData>,
        protected _error?: Error
    ) {

    }

    error() {
        return this._error;
    }

    body(): string {
        return typeof this._response.data === 'object'
            ? JSON.stringify(this._response.data)
            : String(this._response.data);
    }

    json(): TResponse;
    json<K extends keyof TResponse>(key: K): TResponse[K];
    json(key: string, defaultValue?: any): any;
    json(key?: string, defaultValue?: any): any {

        if (key) {
            return Obj.get(this._response.data, key, defaultValue);
        }

        return this._response.data;
    }

    has(key: string): boolean {
        return Obj.has(this._response.data, key);
    }

    // collect(key?: string): Collection {}
    status(): number {
        return Number(this._response.status);
    }

    successful(): boolean {
        return this.status() >= 200 && this.status() < 300;
    }

    redirect(): boolean {
        return this.status() >= 300 && this.status() < 400;
    }

    clientError(): boolean {
        return this.status() >= 400 && this.status() < 500;
    }

    serverError(): boolean {
        return this.status() >= 500;
    }

    failed(): boolean {
        return this.clientError() || this.serverError();
    }

    header(header: string): string {
        return this._response.headers[header];
    }

    headers(): Record<string, string> {
        return this._response.headers as Record<string, string>;
    }

    ok(): boolean {
        return this.status() === 200;
    }

    created(): boolean {
        return this.status() === 201;
    }

    accepted(): boolean {
        return this.status() === 202;
    }

    noContent(): boolean {
        return this.status() === 204;
    }

    movedPermanently(): boolean {
        return this.status() === 301;
    }

    found(): boolean {
        return this.status() === 302;
    }

    badRequest(): boolean {
        return this.status() === 400;
    }

    unauthorized(): boolean {
        return this.status() === 401;
    }

    paymentRequired(): boolean {
        return this.status() === 402;
    }

    forbidden(): boolean {
        return this.status() === 403;
    }

    notFound(): boolean {
        return this.status() === 404;
    }

    requestTimeout(): boolean {
        return this.status() === 408;
    }

    conflict(): boolean {
        return this.status() === 409;
    }

    unprocessableEntity(): boolean {
        return this.status() === 422;
    }

    tooManyRequests(): boolean {
        return this.status() === 429;
    }

    throw(): this {
        if (this.failed()) {
            throw this._error || new Error(this.body());
        }

        return this;
    }

    throwIf(condition: boolean | ((response: Response) => boolean)): this {
        if (typeof condition === 'function') {
            return condition(this) ? this.throw() : this;
        } 
        return condition ? this.throw() : this;
    }

    throwUnless(condition: boolean | ((response: Response) => boolean)): this {
        if (typeof condition === 'function') {
            return condition(this) ? this : this.throw();
        }
        return condition ? this : this.throw();
    }

    throwIfStatus(statusCode: number | ((status: number, response: Response) => boolean)): this {
        if (typeof statusCode === 'function' && statusCode(this.status(), this)) {
            return this.throw();
        } 
        return this.status() === statusCode ? this.throw() : this;
    }

    throwUnlessStatus(statusCode: number | ((status: number, response: Response) => boolean)): this {
        if (typeof statusCode === 'function' && !statusCode(this.status(), this)) {
            return this.throw();
        }
        return this.status() === statusCode ? this : this.throw();
    }

    throwIfClientError(): this {
        return this.clientError() ? this.throw() : this;
    }

    throwIfServerError(): this {
        return this.serverError() ? this.throw() : this;
    }

};
