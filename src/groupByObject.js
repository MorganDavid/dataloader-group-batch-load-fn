// @ts-check
import objectHash from "object-hash";
import { groupBy } from "./groupBy";

/**
 * @typedef {Object<string, unknown>} Dictionary
 */

/**
 * Same as _.groupBy but is able to group by objects using object-hash.
 * @template TKey
 * @param {ReadonlyArray<TKey>} object
 * @param {((v: TKey) => Partial<TKey>)} getProperty - extract the object to group by
 * @returns {Object} - Dictionary of keys grouped by args for easy batch querying.
 */
export const groupByObject = (object, getProperty) => {
  /**
   * @param {TKey} v
   * @returns {string}
   */
  const hashObject = (v) => {
    return objectHash(getProperty(v));
  };

  return groupBy(object, hashObject);
};
