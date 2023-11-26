declare type BatchLoadFn<TKey, TValue> = (
  keys: readonly TKey[]
) => Promise<ArrayLike<TValue | Error>>;

declare function groupedBatchLoadFn<
  TKey extends Record<string, unknown>,
  TValue
>(
  resolve: (
    keys: TKey[],
    staticFields: Partial<TKey>
  ) => Promise<TValue | Error>,
  options: { getStaticFields: (key: TKey) => Partial<TKey> }
): BatchLoadFn<TKey, TValue>;
