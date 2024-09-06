/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { isDraftable, produce } from 'immer';

import { Constructor } from '../Js';

import Collection from '../Collection';
import ReducerOverrideException from '../Exceptions/ReducerOverrideException';

export type ReducerCallback = (value: any, ...params: any[]) => any;

export interface Reducer {
    callback: ReducerCallback,
    priority: number,
}

export type Unsubscribe = () => void;

export type ReducibleInterface = {
    reducer(name: string, callback: ReducerCallback, priority?: number): Unsubscribe;
    removeReducer(name: string, callback: ReducerCallback): void;
    getReducer(name: string): Collection<Reducer>;
    hasReducer(name: string): boolean;
    clearReducer(name: string): void;
    flushReducers(): void;
    [reducer: string]: unknown;
};


export function Reducible<T extends Constructor>(Base: T) {
    return class extends Base {
        _reducers: {
            [name: string]: Collection<Reducer> // Reducer[]
        } = {};

        constructor(...args: any[]) {
            super(...args);
            return new Proxy(this, {
                get(target, prop, receiver) {
                    if (typeof prop === 'symbol' || prop in target) {
                        return Reflect.get(target, prop, receiver);
                    }
                    return (value: unknown, ...args: unknown[]) => {
                        const { [prop]: macros = new Collection<Reducer>() } = target._reducers;

                        if (isDraftable(value)) {
                            return produce(value, (draft: unknown) => {
                                return macros
                                    .sortBy('priority')
                                    .reduce((prevValue, item) => item.callback(prevValue, ...args), draft);
                            });
                        }
    
                        return macros
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
    };
}

