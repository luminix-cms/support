
import { Constructor } from "../Js";

export type MacroMethodMap = Record<string, (...args: any[]) => any>;

export type MacroableInterface<TMacros extends MacroMethodMap> = {
    /**
     * 
     * Register a custom macro
     * 
     * @param name 
     * @param macro 
     */
    macro<K extends keyof TMacros>(name: K, macro: TMacros[K]): void;

    /**
     * 
     * Checks if a macro is registered
     * 
     * @param name
     */
    hasMacro(name: string): boolean;

    /**
     * 
     * Flushes the existing macros.
     * 
     */
    flushMacros(): void;
};

export type MacroableOf<TBase extends Constructor, TMacros extends MacroMethodMap> = Omit<TBase, 'new'> & {
    new (...args: ConstructorParameters<TBase>): InstanceType<TBase> & TMacros & MacroableInterface<TMacros>;
};

export default function Macroable<TMacros extends MacroMethodMap, TBase extends Constructor>(
    Base: TBase
): MacroableOf<TBase, TMacros>
{
    return class extends Base {

        _macros: TMacros = {} as TMacros;

        constructor(...args: any[]) {
            super(...args);

            return new Proxy(this, {
                get(target, prop, receiver) {
                    if (Reflect.has(target, prop)) {
                        return Reflect.get(target, prop, receiver);
                    }

                    if (typeof prop === 'string' && target.hasMacro(prop)) {
                        return target._macros[prop].bind(target);
                    }

                    return Reflect.get(target, prop, receiver);
                },
            });
        }

        macro<K extends keyof TMacros>(name: K, macro: TMacros[K]): void {
            if (typeof macro !== 'function') {
                throw new TypeError('Macro must be a function');
            }

            this._macros[name] = macro;
        }

        hasMacro(name: string): boolean {
            return name in this._macros && typeof this._macros[name] === 'function';
        }

        flushMacros(): void {
            this._macros = {} as TMacros;
        }

    } as any;
}
