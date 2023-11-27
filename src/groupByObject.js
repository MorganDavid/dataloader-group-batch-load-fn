// @ts-check
const objectHash = require("object-hash");
const { groupBy } = require("./groupBy");

/**
 * Similar as _.groupBy but is able to group by objects using object-hash and also returns the index of the original object in `array`.
 * @template TValue
 * @param {ReadonlyArray<TValue>} array
 * @param {((v: TValue) => Partial<TValue>)} getProperty - extract the object to group by
 * @returns {Record<string, ReadonlyArray<{indexInSourceArray:number, value:TValue}>>} - Dictionary of keys grouped by args for easy batch querying.
 */
module.exports.groupByObject = function groupByObject(array, getProperty) {
  /**
   * @param {TValue} v
   * @returns {string}
   */
  const hashObject = (v) => {
    return objectHash(getProperty(v));
  };

  return groupBy(array, hashObject);
};
