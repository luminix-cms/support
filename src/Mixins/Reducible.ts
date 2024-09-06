/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { isDraftable, produce } from 'immer';

import { Constructor } from '../Js';

import Collection from '../Collection';
import ReducerOverrideException from '../Exceptions/ReducerOverrideException';


export type ReducerRepository = {
    [reducer: string]: Collection<Reducer<any, any[]>>;
};

export type ReducerCallback<TValue = any, TParams extends any[] = any[]> = (value: TValue, ...params: TParams) => TValue;

export interface Reducer<TValue = any, TParams extends any[] = any[]> {
    callback: ReducerCallback<TValue, TParams>,
    priority: number,
}

export type Unsubscribe = () => void;

export type ReducerMethodMap = Record<string, (value: any, ...params: any[]) => any>;

type First<T extends any[]> = T extends [infer A, ...any] ? A : unknown;
type Tail<T extends any[]> = T extends [any, ...infer R] ? R : unknown[];

export type ReducerCallbackFor<
    TReducers extends ReducerMethodMap,
    K extends keyof TReducers
> = ReducerCallback<First<Parameters<TReducers[K]>>, Tail<Parameters<TReducers[K]>>>;

export type ReducerFor<
    TReducers extends ReducerMethodMap,
    K extends keyof TReducers
> = Reducer<First<Parameters<TReducers[K]>>, Tail<Parameters<TReducers[K]>>>;

export type ReducibleInterface<TReducers extends ReducerMethodMap> = {

    reducer<K extends keyof TReducers>(name: K, callback: ReducerCallbackFor<TReducers, K>, priority?: number): Unsubscribe;
    removeReducer<K extends keyof TReducers>(name: K, callback: ReducerCallbackFor<TReducers, K>): void;
    getReducer<K extends keyof TReducers>(name: K): Collection<ReducerFor<TReducers, K>>;
    hasReducer(name: string): boolean;
    clearReducer(name: string): void;
    flushReducers(): void;
};

export type ReducibleOf<TBase extends Constructor, TReducers extends ReducerMethodMap> = Omit<TBase, 'new'> & {
    new (...args: ConstructorParameters<TBase>): InstanceType<TBase> & TReducers & ReducibleInterface<TReducers>;
};

export default function Reducible<TReducers extends ReducerMethodMap, TBase extends Constructor>(Base: TBase): ReducibleOf<TBase, TReducers> {
    return class extends Base {
        _reducers: ReducerRepository = {};

        constructor(...args: any[]) {
            super(...args);
            return new Proxy(this, {
                get(target, prop, receiver) {
                    if (typeof prop === 'symbol' || prop in target) {
                        return Reflect.get(target, prop, receiver);
                    }
                    return (value: unknown, ...args: unknown[]) => {
                        const { [prop]: reducers = new Collection<Reducer>() } = target._reducers;

                        if (isDraftable(value)) {
                            return produce(value, (draft: unknown) => {
                                return reducers
                                    .sortBy('priority')
                                    .reduce((prevValue, item) => item.callback(prevValue, ...args), draft);
                            });
                        }
    
                        return reducers
                            .sortBy('priority')
                            .reduce((prevValue, item) => item.callback(prevValue, ...args), value);
                    };
                },

            });
        }
  
        reducer(name: string, callback: ReducerCallback, priority: number = 10) {
            if (name in this) {
                throw new ReducerOverrideException(name, this);
            }
            if (!this._reducers[name]) {
                this._reducers[name] = new Collection<Reducer>();
            }

            this._reducers[name].push({ callback, priority });

            return () => this.removeReducer(name, callback);
        }

        removeReducer(name: string, callback: ReducerCallback) {
            const index = this._reducers[name].search((reducer) => reducer.callback === callback);
            if (index === false) {
                return;
            }
            this._reducers[name].pull(index);
        }

        getReducer(name: string): Collection<Reducer> {
            if (!this._reducers[name]) {
                this._reducers[name] = new Collection<Reducer>();
            }
            return this._reducers[name];
        }

        hasReducer(name: string): boolean {
            return !!this._reducers[name] && this._reducers[name].count() > 0;
        }

        clearReducer(name: string) {
            this._reducers[name].splice(0, this._reducers[name].count());
        }

        flushReducers() {
            Object.values(this._reducers).forEach((collection) => collection.splice(0, collection.count()));
        }
    } as any;
}
