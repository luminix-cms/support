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

export function kebab(string: string): string {
    return _.kebabCase(string);
}

export function studly(string: string): string {
    return _.upperFirst(camel(string));
}

export function snake(string: string): string {
    return _.snakeCase(string);
}

export function trim(string: string, chars?: string): string {
    return _.trim(string, chars);
}

export function upperFirst(string: string): string {
    return _.upperFirst(string);
}
