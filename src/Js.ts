

export type Constructor<TInstance = {}, TArgs extends Array<any> = any[]> = new (...args: TArgs) => TInstance;

export type TypeOf = 'string' | 'number' | 'boolean' | 'object' | 'undefined' | 'function' | 'symbol' | 'bigint';


export type JsonObject = {
    [key: string]: JsonValue,
}

export type JsonValue = string | number | boolean | null | JsonObject | Array<string | number | boolean | null | JsonObject>;
