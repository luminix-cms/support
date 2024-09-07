

export type Constructor<T = {}> = new (...args: any[]) => T;

export type TypeOf = 'string' | 'number' | 'boolean' | 'object' | 'undefined' | 'function' | 'symbol' | 'bigint';


export type JsonObject = {
    [key: string]: JsonValue,
}

export type JsonValue = string | number | boolean | null | JsonObject | Array<string | number | boolean | null | JsonObject>;
