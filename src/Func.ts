
import { throttle, debounce, DebouncedFunc, DebounceSettings, ThrottleSettings } from 'lodash-es';
import Macroable from './Mixins/Macroable';

export declare class FuncMacros {
    [x: string]: (...args: any[]) => any;
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
