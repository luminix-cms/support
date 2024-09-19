import * as _ from "lodash-es";

export function after(string: string, search: string): string {
    if (!string.includes(search)) {
        return '';
    }
    return string.split(search).slice(1).join('');
}

export function afterLast(string: string, search: string): string {
    if (!string.includes(search)) {
        return '';
    }
    return string.split(search).slice(-1).join('');
}

export function before(string: string, search: string): string {
    if (!string.includes(search)) {
        return '';
    }
    return string.split(search).slice(0, 1).join('');
}

export function beforeLast(string: string, search: string): string {
    if (!string.includes(search)) {
        return '';
    }
    return string.split(search).slice(0, -1).join('');
}

export function camel(string: string): string {
    return _.camelCase(string);
}

export function lcfirst(string: string): string {
    return _.lowerFirst(string);
}

export function lower(string: string): string {
    return string.toLowerCase();
}

export function kebab(string: string): string {
    return _.kebabCase(string);
}

export function padBoth(string: string, length: number, chars?: string): string {
    return _.pad(string, length, chars);
}

export function padLeft(string: string, length: number, chars?: string): string {
    return _.padStart(string, length, chars);
}

export function padRight(string: string, length: number, chars?: string): string {
    return _.padEnd(string, length, chars);
}

export function readable(string: string): string {
    return _.capitalize(_.startCase(string));
}

export function studly(string: string): string {
    return _.upperFirst(camel(string));
}

export function snake(string: string): string {
    return _.snakeCase(string);
}

export function title(string: string): string {
    return _.startCase(string);
}

export function trim(string: string, chars?: string): string {
    return _.trim(string, chars);
}

export function ucfirst(string: string): string {
    return _.upperFirst(string);
}

export function upper(string: string): string {
    return string.toUpperCase();
}

// export function upperFirst(string: string): string {
//     return _.upperFirst(string);
// }
