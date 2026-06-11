import Application from "../App/Application";

import { Constructor } from "../Js";

export type HasFacadeAccessor = {
    getFacadeAccessor(): string | object;
}

export type FacadeOf<TService extends object, TBase extends HasFacadeAccessor> = TBase & TService;

export default function MakeFacade<TService extends object, TBase extends HasFacadeAccessor>(Base: Constructor<HasFacadeAccessor, []>, app?: Application): FacadeOf<TService, TBase> {

    return new (class extends Base {

        constructor() {
            super();

            return new Proxy(this, {
                get(target, prop, receiver) {
                    if (Reflect.has(target, prop)) {
                        return Reflect.get(target, prop);
                    }

                    const accessor = target.getFacadeAccessor();

                    const service: TService = typeof accessor === 'string'
                        ? app!.make(accessor)
                        : accessor;

                    if (!service) {
                        throw new Error(`Service ${String(accessor)} does not exist.`);
                    }

                    const value = Reflect.get(service, prop, service);

                    // Invoke methods with `this` bound to the service instance,
                    // not the facade proxy. Otherwise property assignments like
                    // `this.foo = bar` inside a service method would land on
                    // the facade object instead of the service.
                    // Fluent methods (`return this`) resolve back to the facade,
                    // so chains keep facade-only members reachable — e.g.
                    // `App.withProviders(...).down()` where `down` exists only
                    // on the facade class.
                    // Own properties are left untouched: functions stored as
                    // data (e.g. registered callbacks) must keep their identity.
                    if (typeof value === 'function' && !Object.prototype.hasOwnProperty.call(service, prop)) {
                        return function (...args: unknown[]) {
                            const result = value.apply(service, args);

                            return result === service ? receiver : result;
                        };
                    }

                    return value;
                }
            });
        }

    })() as FacadeOf<TService, TBase>;
}


