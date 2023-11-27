// @ts-check

/**
 * similar to _.groupBy but also returns the index of the original object in `collection`.
 * @template TValue
 * @param {ReadonlyArray<TValue>} array The collection to iterate over.
 * @param {(value:TValue) => object} iteratee The iteratee to transform keys.
 * @returns {Record<string, ReadonlyArray<{indexInSourceArray:number, value:TValue}>>} Returns the composed aggregate object with the index of each `value` in the input `array`.
 */
function groupBy(array, iteratee) {
  if (typeof array !== "object" || !array?.length) return {};

  /**
   * @type {Record<string, ReadonlyArray<{indexInSourceArray:number, value:TValue}>>}
   */
  const grouped = array.reduce((result, value, indexInSourceArray) => {
    const key = iteratee(value);
    const existing = result[key];
    if (existing) {
      existing.push({ indexInSourceArray, value });
    } else {
      result[key] = [{ indexInSourceArray, value }];
    }

    return result;
  }, {});

  return grouped;
}

module.exports = { groupBy };
