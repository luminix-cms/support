
import { toFormData as toPlatformData } from 'axios';
import * as _ from 'lodash-es';

export type JsonProperty = null | boolean | number | string;


export function fromQuery(searchParams: URLSearchParams): Record<string, any> {
    const object: Record<string, string> = {};

    for (const [key, value] of searchParams.entries()) {
        set(object, key, value);
    }

    return object;
}

export function fromFormData(formData: FormData): Record<string, any> {
    return fromQuery(formData as unknown as URLSearchParams);
}

export function get(object: any, path: string, defaultValue?: any): any {
    return _.get(object, path, defaultValue);
}

export function has(object: any, path: string): boolean {
    return _.has(object, path);
}

export function isEmpty(object: any): boolean {
    return _.isEmpty(object);
}

export function isEqual(object: any, other: any): boolean {
    return _.isEqual(object, other);
}

export function merge(object: any, ...sources: any[]): any {
    return _.merge(object, ...sources);
}

export function omit(object: any, ...paths: string[]): any {
    return _.omit(object, ...paths);
}

export function pick(object: any, ...paths: string[]): any {
    return _.pick(object, ...paths);
}

export function set(object: any, path: string, value: any): void {
    

    _.set(object, path, value);
}

export function toQuery(object: any): URLSearchParams {
    return toPlatformData(object, new URLSearchParams()) as URLSearchParams;
}

export function toFormData(object: any): FormData {
    return toPlatformData(object, new FormData()) as FormData;
}

export function unset(object: any, path: string): void {
    _.unset(object, path);
}




