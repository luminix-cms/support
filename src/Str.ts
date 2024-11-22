import {
    camelCase, lowerFirst, kebabCase, pad, padStart, padEnd, capitalize,
    startCase, upperFirst, snakeCase, trim,
} from "lodash-es";
import Macroable from "./Mixins/Macroable";

export declare class StrMacros {
    [x: string]: (...args: any[]) => any;
}

class StrStatic {

    after(string: string, search: string): string {
        if (!string.includes(search)) {
            return '';
        }
        return string.split(search).slice(1).join('');
    }
    
    afterLast(string: string, search: string): string {
        if (!string.includes(search)) {
            return '';
        }
        return string.split(search).slice(-1).join('');
    }
    
    before(string: string, search: string): string {
        if (!string.includes(search)) {
            return '';
        }
        return string.split(search).slice(0, 1).join('');
    }
    
    beforeLast(string: string, search: string): string {
        if (!string.includes(search)) {
            return '';
        }
        return string.split(search).slice(0, -1).join('');
    }
    
    camel(string: string): string {
        return camelCase(string);
    }
    
    lcfirst(string: string): string {
        return lowerFirst(string);
    }
    
    lower(string: string): string {
        return string.toLowerCase();
    }
    
    kebab(string: string): string {
        return kebabCase(string);
    }
    
    padBoth(string: string, length: number, chars?: string): string {
        return pad(string, length, chars);
    }
    
    padLeft(string: string, length: number, chars?: string): string {
        return padStart(string, length, chars);
    }
    
    padRight(string: string, length: number, chars?: string): string {
        return padEnd(string, length, chars);
    }
    
    human(string: string): string {
        return capitalize(startCase(string));
    }
    
    studly(string: string): string {
        return upperFirst(this.camel(string));
    }
    
    snake(string: string): string {
        return snakeCase(string);
    }
    
    title(string: string): string {
        return startCase(string);
    }
    
    trim(string: string, chars?: string): string {
        return trim(string, chars);
    }
    
    ucfirst(string: string): string {
        return upperFirst(string);
    }
    
    upper(string: string): string {
        return string.toUpperCase();
    }
}

const Str = new (Macroable<StrMacros, typeof StrStatic>(StrStatic))();

export default Str;
