// @ts-check

import { groupByObject } from "./groupByObject";
import objectHash from "object-hash";

/**
 * @template TKey, TValue
 * @param {(keys: ArrayLike<TKey>, staticFields: Partial<TKey>) => Promise<TValue | Error>} resolve
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

    const entries = Object.entries(grouped);

    const queryResultsPartitionedByFilter = await Promise.all(
      entries.map(async ([staticFieldsObjectHash, keys]) => {
        return resolve(keys, getStaticFields(keys[0])).then((result) => ({
          result,
          hashedKey: staticFieldsObjectHash,
        }));
      })
    );

    const sortedResults = keys.map((key) => {
      const hash = objectHash(getStaticFields(key));
      const matchingResult = queryResultsPartitionedByFilter.find(
        ({ hashedKey }) => hashedKey === hash
      );

      const out = matchingResult?.result;
      return (
        out ??
        new Error(
          `Your resolve function returned null or undefined for key: ${key}`
        )
      );
    });

    return sortedResults;
  };

  return batchLoadFunction;
};
