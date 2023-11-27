/**
 * similar to _.groupBy but also returns the index of the original object in `collection`.
 * @template TValue
 * @param {ReadonlyArray<TValue>} array The collection to iterate over.
 * @param {(value:TValue) => object} iteratee The iteratee to transform keys.
 * @returns {Record<string, ReadonlyArray<{indexInSourceArray:number, value:TValue}>>} Returns the composed aggregate object with the index of each `value` in the input `array`.
 */
export function groupBy<TValue>(array: readonly TValue[], iteratee: (value: TValue) => object): Record<string, readonly {
    indexInSourceArray: number;
    value: TValue;
}[]>;
