/**
 * Similar as _.groupBy but is able to group by objects using object-hash and also returns the index of the original object in `array`.
 * @template TValue
 * @param {ReadonlyArray<TValue>} array
 * @param {((v: TValue) => Partial<TValue>)} getProperty - extract the object to group by
 * @returns {Record<string, ReadonlyArray<{indexInSourceArray:number, value:TValue}>>} - Dictionary of keys grouped by args for easy batch querying.
 */
export function groupByObject<TValue>(array: readonly TValue[], getProperty: (v: TValue) => Partial<TValue>): Record<string, readonly {
    indexInSourceArray: number;
    value: TValue;
}[]>;
