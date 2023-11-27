// @ts-check
const { groupByObject } = require("./groupByObject");

/**
 * Groups all keys passed to it by object-hashing the result of `getArgs` on each key.
 * Then, it calls and awaits `groupedBatchLoadFn` once for every group of keys.
 * @template TKey, TValue
 * @param {import(".").GroupedBatchLoadFn<TKey, TValue>} groupedBatchLoadFn Must return an array of results where each element in the results corresponds to the element in the keys array with the same index.
 * @param {import(".").Options<TKey>} options getArgs is required in options.
 * @returns {import(".").BatchLoadFn<TKey, TValue>} A standard DataLoader BatchLoadFn to pass to a DataLoader constructor.
 */
module.exports.groupBatchLoadFn = function groupBatchLoadFn(
  groupedBatchLoadFn,
  options
) {
  if (!options) throw new Error("options missing");

  const getArgs = options.getArgs;

  if (typeof getArgs !== "function")
    throw new Error("options.getArgs is not a function");

  /**
   * @type {import(".").BatchLoadFn<TKey, TValue>}
   */
  const batchLoadFunction = async (keys) => {
    const grouped = groupByObject(keys, getArgs);

    const values = Object.values(grouped);

    const queryResultsGroupedByArgs = await Promise.all(
      values.map(async (keysAndIndexesForThisGroup) => {
        const keys = Array.from(
          keysAndIndexesForThisGroup.map(({ value }) => value)
        );

        const results = Array.from(
          await groupedBatchLoadFn(keys, getArgs(keys[0]))
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

    const flattened = queryResultsGroupedByArgs.flat();

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
