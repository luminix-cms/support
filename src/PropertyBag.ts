import { produce } from 'immer';
import EventSource, { Event } from './Contracts/EventSource';
import Obj from './Obj';

export type PropertyBagChangeEvent = {
    path: string;
    value: unknown;
    type: 'set' | 'merge' | 'delete';
};

export type PropertyBagEventMap<T extends object = any> = {
    'change': (e: Event<PropertyBagChangeEvent, PropertyBag<T>>) => void; 
};

class PropertyBag<T extends object> extends EventSource<PropertyBagEventMap<T>>
{

    private locked: string[] = [];

    constructor(private bag: T) {
        super();
        Object.freeze(this.bag);
    }

    get(path: string, defaultValue?: unknown) {
        return Obj.get(this.bag, path, defaultValue);
    }

    set(path: string, value: unknown) {
        if (this.locked.some((item) => path.startsWith(item))) {
            throw new Error(`Cannot set a locked path "${path}"`);
        }

        if (typeof value === 'object' && value !== null) {
            if (this.locked.some((item) => Obj.has(value, item.slice(path.length + 1)))) {
                throw new Error(`Cannot set a path "${path}" that would override a locked path`);
            }
        }

        if (path === '.') {
            if (this.locked.length) {
                throw new Error('Cannot set the root path when there are locked paths');
            }

            if (typeof value !== 'object' || value === null) {
                throw new TypeError('Value must be an object');
            }

            this.bag = produce(this.bag, () => value);
            this.emit('change', {
                path,
                value,
                type: 'set',
                source: this,
            });
            return;
        }

        this.bag = produce(this.bag, (draft) => {
            Obj.set(draft, path, value);
        });

        this.emit('change', {
            path,
            value,
            type: 'set',
            source: this,
        });
    }

    merge(path: string, value: unknown) {
        if (typeof value !== 'object' || value === null) {
            throw new TypeError('Value must be an object');
        }
        
        if (path === '.') {
            if (this.locked.some((item) => Obj.has(value, item))) {
                throw new Error(`Cannot merge a path "${path}" that would override a locked path`);
            }
            this.bag = produce(this.bag, (draft) => {
                return {
                    ...draft,
                    ...value,
                };
            });
            this.emit('change', {
                path,
                value,
                type: 'merge',
                source: this,
            });
            return;
        }

        const currentValue = this.get(path);

        if (typeof currentValue === 'object' && currentValue !== null) {
            return this.set(path, {
                ...currentValue,
                ...value,
            });
        }

        if (currentValue === null || typeof currentValue === 'undefined') {
            return this.set(path, value);
        }

        throw new Error(`Cannot merge a non-object path "${path}"`);
    }

    has(path: string) {
        return Obj.has(this.bag, path);
    }

    delete(path: string) {
        if (this.locked.some((item) => path.startsWith(item))) {
            throw new Error(`Cannot delete a locked path "${path}"`);
        }
        this.bag = produce(this.bag, (draft) => {
            Obj.unset(draft, path);
        });

        this.emit('change', {
            path,
            value: null,
            type: 'delete',
            source: this,
        });
    }

    lock(path: string) {
        if (!this.has(path)) {
            throw new Error(`Cannot lock a non-existing path "${path}"`);
        }
        this.locked.push(path);
    }

    clone(): PropertyBag<T>
    {
        return new PropertyBag(this.bag);
    }

    all() {
        return this.bag;
    }

    isEmpty() {
        return Obj.isEmpty(this.bag);
    }

}

export default PropertyBag;
