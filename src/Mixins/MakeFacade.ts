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

                    return Reflect.get(service, prop, service);
                }
            });
        }

    })() as FacadeOf<TService, TBase>;
}


