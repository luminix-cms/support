
import _, { DebouncedFunc, DebounceSettings, ThrottleSettings } from 'lodash-es';

export function throttle<T extends (...args: any) => any>(func: T, wait?: number, options?: ThrottleSettings): DebouncedFunc<T> {
    return _.throttle(func, wait, options);
}

export function debounce<T extends (...args: any) => any>(func: T, wait?: number, options?: DebounceSettings): DebouncedFunc<T> {
    return _.debounce(func, wait, options);
}


