declare type BatchLoadFn<TKey, TValue> = (
  keys: readonly TKey[]
) => Promise<ArrayLike<TValue | Error>>;

declare type GroupedBatchLoadFn<TKey, TValue> = (
  keys: ArrayLike<TKey>,
  staticFields: Partial<TKey>
) => Promise<ArrayLike<TValue | Error>>;

declare type GetStaticFields<TKey> = (key: TKey) => Partial<TKey>;

declare type Options<TKey> = { getStaticFields: (key: TKey) => Partial<TKey> };
