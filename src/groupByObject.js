// @ts-check
import objectHash from "object-hash";
import { groupBy } from "./groupBy";

/**
 * @typedef {Object<string, unknown>} Dictionary
 */

/**
 * Similar as _.groupBy but is able to group by objects using object-hash and also returns the index of the original object in `array`.
 * @template TValue
 * @param {ReadonlyArray<TValue>} array
 * @param {((v: TValue) => Partial<TValue>)} getProperty - extract the object to group by
 * @returns {Record<string, ReadonlyArray<{indexInSourceArray:number, value:TValue}>>} - Dictionary of keys grouped by args for easy batch querying.
 */
export const groupByObject = (array, getProperty) => {
  /**
   * @param {TValue} v
   * @returns {string}
   */
  const hashObject = (v) => {
    return objectHash(getProperty(v));
  };

  return groupBy(array, hashObject);
};
