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
                get(target, prop) {
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

                    // Bind methods to the service so `this` inside them is the
                    // service instance, not the facade proxy. Otherwise property
                    // assignments like `this.foo = bar` inside a service method
                    // would land on the facade object instead of the service.
                    // Own properties are left untouched: functions stored as
                    // data (e.g. registered callbacks) must keep their identity.
                    if (typeof value === 'function' && !Object.prototype.hasOwnProperty.call(service, prop)) {
                        return value.bind(service);
                    }

                    return value;
                }
            });
        }

    })() as FacadeOf<TService, TBase>;
}


