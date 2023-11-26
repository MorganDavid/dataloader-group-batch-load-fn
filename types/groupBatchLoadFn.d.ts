/**
 * Groups all keys passed to it by object-hashing the result of `getStaticFields` on each key.
 * Then, it calls and awaits `groupedBatchLoadFn` once for every group of keys.
 * @template TKey, TValue
 * @param {GroupedBatchLoadFn<TKey, TValue>} groupedBatchLoadFn Must return an array of results where each element in the results corresponds to the element in the keys array with the same index.
 * @param {Options<TKey>} options getStaticFields is required in options.
 * @returns {BatchLoadFn<TKey, TValue>} A standard DataLoader BatchLoadFn to pass to a DataLoader constructor.
 */
export function groupBatchLoadFn<TKey, TValue>(groupedBatchLoadFn: GroupedBatchLoadFn<TKey, TValue>, options: Options<TKey>): BatchLoadFn<TKey, TValue>;
export type BatchLoadFn<TKey, TValue> = (keys: TKey[]) => Promise<(Error | TValue)[]>;
export type GroupedBatchLoadFn<TKey, TValue> = (keys: TKey[], staticFields: Partial<TKey>) => Promise<ArrayLike<Error | TValue>>;
export type GetStaticFields<TKey> = (key: TKey) => Partial<TKey>;
export type Options<TKey> = {
    getStaticFields: GetStaticFields<TKey>;
};
