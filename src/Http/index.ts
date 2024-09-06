import Client, { RequestOptions } from "./Client";
import Response from "./Response";
import Request from "./Request";
import Macroable from "../Mixins/Macroable";

class HttpStatic {

    get Client() {
        return Client;
    }

    get Response() {
        return Response;
    }

    get Request() {
        return Request;
    }

    getClient(): Client {
        return new Client();
    }

    baseUrl(baseUrl: string): Client {
        return this.getClient().baseUrl(baseUrl);
    }

    asForm(): Client {
        return this.getClient().asForm();
    }

    accept(type: string): Client {
        return this.getClient().accept(type);
    }

    acceptJson(): Client {
        return this.getClient().acceptJson();
    }

    withHeaders(headers: Record<string, string>): Client {
        return this.getClient().withHeaders(headers);
    }

    withOptions(options: RequestOptions): Client {
        return this.getClient().withOptions(options);
    }


    withQueryParameters(params: string | object): Client {
        return this.getClient().withQueryParameters(params);
    }

    withBasicAuth(username: string, password: string): Client {
        return this.getClient().withBasicAuth(username, password);
    }

    withToken(token: string): Client {
        return this.getClient().withToken(token);
    }

    get<TResponse = any>(url: string, query?: string | object) {
        return this.getClient().get<TResponse>(url, query);
    }


    post<TResponse = any, TData = any>(url: string, data?: TData) {
        return this.getClient().post<TResponse, TData>(url, data);
    }


    put<TResponse = any, TData = any>(url: string, data?: TData) {
        return this.getClient().put<TResponse, TData>(url, data);
    }


    patch<TResponse = any, TData = any>(url: string, data?: TData) {
        return this.getClient().patch<TResponse, TData>(url, data);
    }


    delete<TResponse = any>(url: string, query?: string | object) {
        return this.getClient().delete<TResponse>(url, query);
    }

}

const Http = new (Macroable<Record<string, () => Client>, typeof HttpStatic>(HttpStatic))();

export default Http;

