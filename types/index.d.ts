export type BatchLoadFn<TKey, TValue> = (keys: readonly TKey[]) => PromiseLike<ArrayLike<Error | TValue>>;
export type GroupedBatchLoadFn<TKey, TValue> = (keys: TKey[], args: Partial<TKey>) => Promise<ArrayLike<Error | TValue>>;
export type getArgs<TKey> = (key: TKey) => Partial<TKey>;
export type Options<TKey> = {
    getArgs: getArgs<TKey>;
};
