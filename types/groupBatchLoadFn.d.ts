/**
 * Groups all keys passed to it by object-hashing the result of `getStaticFields` on each key.
 * Then, it calls and awaits `groupedBatchLoadFn` once for every group of keys.
 * @template TKey, TValue
 * @param {import(".").GroupedBatchLoadFn<TKey, TValue>} groupedBatchLoadFn Must return an array of results where each element in the results corresponds to the element in the keys array with the same index.
 * @param {import(".").Options<TKey>} options getStaticFields is required in options.
 * @returns {import(".").BatchLoadFn<TKey, TValue>} A standard DataLoader BatchLoadFn to pass to a DataLoader constructor.
 */
export function groupBatchLoadFn<TKey, TValue>(groupedBatchLoadFn: import(".").GroupedBatchLoadFn<TKey, TValue>, options: import(".").Options<TKey>): import(".").BatchLoadFn<TKey, TValue>;
