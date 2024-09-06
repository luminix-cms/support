import axios, { AxiosRequestConfig, isAxiosError } from "axios";
import Response from "./Response";

export default class Request<TResponse = any, TData = any> implements Promise<Response<TResponse, TData>> {

    private promise: Promise<Response<TResponse, TData>>;
    private response?: Response<TResponse, TData>;

    constructor(options: AxiosRequestConfig) {
        this.promise = new Promise<Response<TResponse, TData>>((resolve, reject) => {
            axios(options)
                .then((response) => {
                    this.response = new Response(response);
                    resolve(this.response);
                })
                .catch((error) => {
                    if (isAxiosError(error) && error.response) {
                        this.response = new Response(error.response, error);
                        resolve(this.response);
                    } else {
                        reject(error);
                    }
                });
        });
    }

    [Symbol.toStringTag]: string = 'Request';

    then<TResult1 = Response<TResponse, TData>, TResult2 = never>(
        onfulfilled?: ((value: Response<TResponse, TData>) => TResult1 | PromiseLike<TResult1>) | null | undefined,
        onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined
    ): Promise<TResult1 | TResult2> {
        return this.promise.then(onfulfilled, onrejected);
    }

    catch<TResult = never>(
        onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null | undefined
    ): Promise<Response<TResponse, TData> | TResult> {
        return this.promise.catch(onrejected);
    }

    finally(onfinally?: (() => void) | null | undefined): Promise<Response<TResponse, TData>> {
        return this.promise.finally(onfinally);
    }
}
