declare type BatchLoadFn<TKey, TValue> = (
  keys: readonly TKey[]
) => Promise<ArrayLike<TValue | Error>>;
