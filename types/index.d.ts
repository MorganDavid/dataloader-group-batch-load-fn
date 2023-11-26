export { groupBatchLoadFn } from "./groupBatchLoadFn";
export type BatchLoadFn<TKey, TValue> = (keys: readonly TKey[]) => PromiseLike<ArrayLike<Error | TValue>>;
export type GroupedBatchLoadFn<TKey, TValue> = (keys: TKey[], staticFields: Partial<TKey>) => Promise<ArrayLike<Error | TValue>>;
export type GetStaticFields<TKey> = (key: TKey) => Partial<TKey>;
export type Options<TKey> = {
    getStaticFields: GetStaticFields<TKey>;
};
