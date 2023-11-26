// @ts-check
import objectHash from "object-hash";
import { groupBy } from "./groupBy";

/**
 * @typedef {Object<string, unknown>} Dictionary
 */

/**
 * Same as _.groupBy but is able to group by objects using object-hash.
 * @template TKey
 * @param {ReadonlyArray<TKey>} objects
 * @param {((v: TKey) => Partial<TKey>)} getProperty - extract the object to group by
 * @returns {Record<string, ReadonlyArray<{index:number, key:TKey}>>} - Dictionary of keys grouped by args for easy batch querying.
 */
export const groupByObject = (objects, getProperty) => {
  /**
   * @param {TKey} v
   * @returns {string}
   */
  const hashObject = (v) => {
    return objectHash(getProperty(v));
  };

  return groupBy(objects, hashObject);
};
