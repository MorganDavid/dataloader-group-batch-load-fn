// @ts-check
import { groupByObject } from "./groupByObject";

/**
 * Groups all keys passed to it by object-hashing the result of `getStaticFields` on each key.
 * Then, it calls and awaits `groupedBatchLoadFn` once for every group of keys.
 * @template TKey, TValue
 * @param {GroupedBatchLoadFn<TKey, TValue>} groupedBatchLoadFn Must return an array of results where each element in the results corresponds to the element in the keys array with the same index.
 * @param {Options<TKey>} options getStaticFields is required in options.
 * @returns {BatchLoadFn<TKey, TValue>} A standard DataLoader BatchLoadFn to pass to a DataLoader constructor.
 */
export function groupBatchLoadFn(groupedBatchLoadFn, options) {
  if (!options) throw new Error("options missing");

  const getStaticFields = options.getStaticFields;

  if (typeof getStaticFields !== "function")
    throw new Error("options.getStaticFields is not a function");

  /**
   * @type {BatchLoadFn<TKey, TValue>}
   */
  const batchLoadFunction = async (keys) => {
    const grouped = groupByObject(keys, getStaticFields);

    const values = Object.values(grouped);

    const queryResultsGroupedByStaticFields = await Promise.all(
      values.map(async (keysAndIndexesForThisGroup) => {
        const keys = Array.from(
          keysAndIndexesForThisGroup.map(({ value }) => value)
        );

        const results = Array.from(
          await groupedBatchLoadFn(keys, getStaticFields(keys[0]))
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

    const flattened = queryResultsGroupedByStaticFields.flat();

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
}

/**
 * @template TKey, TValue
 * @callback BatchLoadFn
 * @param {Array<TKey>} keys
 * @returns {Promise<Array<TValue | Error>>}
 *
 */
/**
 * @template TKey, TValue
 * @callback GroupedBatchLoadFn
 * @param {Array<TKey>} keys
 * @param {Partial<TKey>} staticFields
 * @returns {Promise<ArrayLike<TValue | Error>>}
 */
/**
 * @template TKey
 * @callback GetStaticFields
 * @param {TKey} key
 * @returns {Partial<TKey>}
 */
/**
 * @template TKey
 * @typedef {Object} Options
 * @property {GetStaticFields<TKey>} getStaticFields
 */
