export type BatchLoadFn<TKey, TValue> = (
  keys: readonly TKey[]
) => PromiseLike<ArrayLike<Error | TValue>>;
export type GroupedBatchLoadFn<TKey, TValue> = (
  keys: TKey[],
  args: Partial<TKey>
) => Promise<ArrayLike<Error | TValue>>;
export type getArgs<TKey> = (key: TKey) => Partial<TKey>;
export type Options<TKey> = {
  getArgs: getArgs<TKey>;
};
/**
 * Groups all keys passed to it by object-hashing the result of `getArgs` on each key.
 * Then, it calls and awaits `groupedBatchLoadFn` once for every group of keys.
 * @template TKey, TValue
 * @param {import(".").GroupedBatchLoadFn<TKey, TValue>} groupedBatchLoadFn Must return an array of results where each element in the results corresponds to the element in the keys array with the same index.
 * @param {import(".").Options<TKey>} options getArgs is required in options.
 * @returns {import(".").BatchLoadFn<TKey, TValue>} A standard DataLoader BatchLoadFn to pass to a DataLoader constructor.
 */
export const groupBatchLoadFn: <TKey, TValue>(
  groupedBatchLoadFn: GroupedBatchLoadFn<TKey, TValue>,
  options: Options<TKey>
) => BatchLoadFn<TKey, TValue>;
