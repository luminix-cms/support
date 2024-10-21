
import { throttle, debounce } from 'lodash-es';
import Macroable from './Mixins/Macroable';

export declare class FuncMacros {
    [x: string]: (...args: any[]) => any;
}

interface DebouncedFunc<T extends (...args: any[]) => any> {
    /**
     * Call the original function, but applying the debounce rules.
     *
     * If the debounced function can be run immediately, this calls it and returns its return
     * value.
     *
     * Otherwise, it returns the return value of the last invocation, or undefined if the debounced
     * function was not invoked yet.
     */
    (...args: Parameters<T>): ReturnType<T> | undefined;

    /**
     * Throw away any pending invocation of the debounced function.
     */
    cancel(): void;

    /**
     * If there is a pending invocation of the debounced function, invoke it immediately and return
     * its return value.
     *
     * Otherwise, return the value from the last invocation, or undefined if the debounced function
     * was never invoked.
     */
    flush(): ReturnType<T> | undefined;
}

interface DebounceSettings {

    leading?: boolean | undefined;

    maxWait?: number | undefined;

    trailing?: boolean | undefined;
}

interface ThrottleSettings {

    leading?: boolean | undefined;

    trailing?: boolean | undefined;
}

class FuncStatic {

    throttle<T extends (...args: any) => any>(func: T, wait?: number, options?: ThrottleSettings): DebouncedFunc<T> {
        return throttle(func, wait, options);
    }
    
    debounce<T extends (...args: any) => any>(func: T, wait?: number, options?: DebounceSettings): DebouncedFunc<T> {
        return debounce(func, wait, options);
    }
}

const Func = new (Macroable<FuncMacros, typeof FuncStatic>(FuncStatic))();

export default Func;
