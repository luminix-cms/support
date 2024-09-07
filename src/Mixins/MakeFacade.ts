import Application from "../App/Application";

import { Constructor } from "../Js";

export type HasFacadeAccessor = {
    getFacadeAccessor(): string | object;
}

export type FacadeOf<TService extends object, TBase extends HasFacadeAccessor> = TBase & TService;

export default function MakeFacade<TService extends object, TBase extends HasFacadeAccessor>(Base: Constructor<HasFacadeAccessor>, app?: Application): FacadeOf<TService, TBase> {
    
    class Facade extends Base {

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        constructor(...args: any[]) {
            super(...args);

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

                    if (Reflect.has(service, prop)) {
                        return Reflect.get(service, prop);
                    }

                    throw new Error(`Property '${String(prop)}' does not exist on '${target.getFacadeAccessor()}'`);
                }
            });
        }

    }

    return new Facade() as FacadeOf<TService, TBase>;
}


