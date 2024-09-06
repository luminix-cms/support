

export type Constructor<T = {}> = new (...args: any[]) => T;

export type TypeOf = 'string' | 'number' | 'boolean' | 'object' | 'undefined' | 'function' | 'symbol' | 'bigint';
