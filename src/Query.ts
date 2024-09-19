import * as Obj from "./Obj";
import * as Str from "./Str";

export type Operator = '=' | '!=' | '>' | '>=' | '<' | '<=';

export function fromObject(object: object): URLSearchParams {
    return Obj.toQuery(object);
}

export function toObject(searchParams: URLSearchParams) {
    return Obj.fromQuery(searchParams);
}

export function merge(...parts: (string | URLSearchParams)[]): URLSearchParams {
 
    const searchParams = new URLSearchParams();
    parts.forEach((part) => {

        const params = typeof part === 'string'
            ? new URLSearchParams(Str.after(part, '?'))
            : part;

        params.forEach((value, key) => {
            searchParams.set(key, value);
        });
    });

    return searchParams;
}
