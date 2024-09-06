import * as _ from 'lodash-es';

/**
 * 
 * Calculates the Cartesian product of the given arrays.
 * 
 */
export function cartesian<T>(...arrays: T[][]): T[][] {
    return arrays.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())) as T[]) as T[][];
}


/**
 * 
 * Gets an array of random elements from the given `array`.
 * 
 */
export function sampleSize(array: any[], n: number): any[] {
    return _.sampleSize(array, n);
}


/**
 * 
 * Returns a shuffled copy of `array`.
 *
 */
export function shuffle<T>(array: T[]): T[] {
    return _.shuffle(array);
}



