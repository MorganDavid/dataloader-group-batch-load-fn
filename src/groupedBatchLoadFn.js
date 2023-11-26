// @ts-check

import { groupByObject } from "./groupByObject";

/**
 * @template TKey, TValue
 * @param {(keys: ArrayLike<TKey>, staticFields: Partial<TKey>) => Promise<ArrayLike<TValue | Error>>} resolve
 * @param {{ getStaticFields: (key: TKey) => Partial<TKey> }} options
 * @returns {BatchLoadFn<TKey, TValue>}
 */
export const groupedBatchLoadFn = (resolve, options) => {
  if (!options) throw new Error("options missing");

  const { getStaticFields } = options;

  if (typeof getStaticFields !== "function")
    throw new Error("options.getStaticFields is not a function");

  /**
   * @type {function(ReadonlyArray<TKey>): Promise<ArrayLike<TValue | Error>>}
   */
  const batchLoadFunction = async (keys) => {
    const grouped = groupByObject(keys, getStaticFields);

    const values = Object.values(grouped);

    const queryResultsPartitionedByFilter = await Promise.all(
      values.map(async (keysAndIndexesForThisGroup) => {
        const keys = keysAndIndexesForThisGroup.map(({ value }) => value);

        const results = Array.from(
          await resolve(keys, getStaticFields(keys[0]))
        );

        if (results.length !== keysAndIndexesForThisGroup.length)
          throw new Error(
            "the length of the array returned by resolve() must be equal to the length of the keys array"
          );

        const resultsWithIndex = results.map((result, index) => ({
          result,
          indexInKeys: keysAndIndexesForThisGroup[index].indexInSourceArray,
        }));

        return resultsWithIndex;
      })
    );

    const flattened = queryResultsPartitionedByFilter.flat();

    /**
     * @type {Array<TValue | Error>}
     */
    const resultsOrderedInTheSameIndexesAsKeys = new Array(keys.length);

    for (const { indexInKeys, result } of flattened) {
      resultsOrderedInTheSameIndexesAsKeys[indexInKeys] = result;
    }

    return resultsOrderedInTheSameIndexesAsKeys;
  };

  return batchLoadFunction;
};
