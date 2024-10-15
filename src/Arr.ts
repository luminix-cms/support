import * as _ from 'lodash-es';
import Macroable from './Mixins/Macroable';

// export type ArrMacros = Record<string, (...args: any[]) => any>;

export declare class ArrMacros {
    [x: string]: (...args: any[]) => any;
}

class ArrStatic {

    /**
     * 
     * Calculates the Cartesian product of the given arrays.
     * 
     */
    cartesian<T>(...arrays: T[][]): T[][] {
        return arrays.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())) as T[]) as T[][];
    }


    /**
     * 
     * Gets an array of random elements from the given `array`.
     * 
     */
    sampleSize(array: any[], n: number): any[] {
        return this.shuffle(array).slice(0, n);
    }


    /**
     * 
     * Returns a shuffled copy of `array`.
     *
     */
    shuffle<T>(array: T[]): T[] {
        return _.shuffle(array);
    }

}

const Arr = new (Macroable<ArrMacros, typeof ArrStatic>(ArrStatic))();

export default Arr;
