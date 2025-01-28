import Macroable from "./Mixins/Macroable";
import Obj from "./Obj";
import Str from "./Str";

export type Operator = '=' | '!=' | '>' | '>=' | '<' | '<=';

export declare class QueryMacros {
    [x: string]: (...args: any[]) => any;
}

class QueryStatic {

    fromObject(object: object): URLSearchParams {
        return Obj.toQuery(object);
    }
    
    toObject(searchParams: URLSearchParams) {
        return Obj.fromQuery(searchParams);
    }
    
    merge(...parts: (string | URLSearchParams)[]): URLSearchParams {
     
        const searchParams = new URLSearchParams();

        parts.forEach((part) => {
            const params = typeof part === 'string'
                ? new URLSearchParams(Str.after(part, '?'))
                : part;
    
            params.forEach((value, key) => {
                searchParams.set(key, value);
            });
        });
    
        return searchParams;
    }

}

const Query = new (Macroable<QueryMacros, typeof QueryStatic>(QueryStatic))();

export default Query;
