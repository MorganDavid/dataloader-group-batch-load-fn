declare module "dataloader-group-batch-load-fn" {
  type BatchLoadFn<TKey, TValue> = (
    keys: readonly TKey[]
  ) => Promise<ArrayLike<TValue | Error>>;

  type GroupedBatchLoadFn<TKey, TValue> = (
    keys: ArrayLike<TKey>,
    staticFields: Partial<TKey>
  ) => Promise<ArrayLike<TValue | Error>>;

  type GetStaticFields<TKey> = (key: TKey) => Partial<TKey>;

  type Options<TKey> = {
    getStaticFields: (key: TKey) => Partial<TKey>;
  };

  function groupBatchLoadFn<TKey, TValue>(
    batchLoadFn: GroupedBatchLoadFn<TKey, TValue>,
    options: Options<TKey>
  ): BatchLoadFn<TKey, TValue>;
}
