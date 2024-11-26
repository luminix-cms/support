
import { toFormData as toPlatformData } from 'axios';
import * as _ from 'lodash-es';
import Macroable from './Mixins/Macroable';

export declare class ObjMacros {
    [x: string]: (...args: any[]) => any;
}

export class ObjStatic {
    
    fromQuery(searchParams: URLSearchParams): Record<string, any> {
        const object: Record<string, string> = {};
    
        for (const [key, value] of searchParams.entries()) {
            this.set(object, key, value);
        }
    
        return object;
    }
    
    fromFormData(formData: FormData): Record<string, any> {
        return this.fromQuery(formData as unknown as URLSearchParams);
    }
    
    get(object: any, path: string, defaultValue?: any): any {
        return _.get(object, path, defaultValue);
    }
    
    has(object: any, path: string): boolean {
        return _.has(object, path);
    }
    
    isEmpty(object: any): boolean {
        return _.isEmpty(object);
    }
    
    isEqual(object: any, other: any): boolean {
        return _.isEqual(object, other);
    }
    
    merge(target: any, ...sources: any[]): any {
        let clone: any;
        try {
            clone = structuredClone(target);
        } catch (e) {
            clone = _.cloneDeep(target);
        }
        _.merge(clone, ...sources);
        return clone;
    }
    
    omit(object: any, ...paths: string[]): any {
        return _.omit(object, ...paths);
    }
    
    pick(object: any, ...paths: string[]): any {
        return _.pick(object, ...paths);
    }
    
    set(object: any, path: string, value: any): void {
        
    
        _.set(object, path, value);
    }
    
    toQuery(object: any): URLSearchParams {
        return toPlatformData(object, new URLSearchParams()) as URLSearchParams;
    }
    
    toFormData(object: any): FormData {
        return toPlatformData(object, new FormData()) as FormData;
    }
    
    unset(object: any, path: string): void {
        _.unset(object, path);
    }

}

const Obj = new (Macroable<ObjMacros, typeof ObjStatic>(ObjStatic))();

export default Obj;
