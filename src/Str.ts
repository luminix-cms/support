import * as _ from "lodash-es";


export function camelCase(string: string): string {
    return _.camelCase(string);
}

export function endsWith(string: string, suffix: string): boolean {
    return _.endsWith(string, suffix);
}

export function kebabCase(string: string): string {
    return _.kebabCase(string);
}

export function pascalCase(string: string): string {
    return _.upperFirst(camelCase(string));
}

export function snakeCase(string: string): string {
    return _.snakeCase(string);
}

export function startsWith(string: string, prefix: string): boolean {
    return _.startsWith(string, prefix);
}

export function trim(string: string, chars?: string): string {
    return _.trim(string, chars);
}

export function upperFirst(string: string): string {
    return _.upperFirst(string);
}
