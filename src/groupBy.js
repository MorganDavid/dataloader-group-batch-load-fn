// @ts-check

/**
 * @template T
 * @param {ReadonlyArray<T>} collection The collection to iterate over.
 * @param {Function} iteratee The iteratee to transform keys.
 * @returns {Object} Returns the composed aggregate object.
 */
export function groupBy(collection, iteratee) {
  if (typeof collection !== "object" || !collection?.length) return {};

  return collection.reduce((result, value) => {
    const key = iteratee(value);
    const existing = result[key];
    if (existing) {
      existing.push(value);
    } else {
      result[key] = [value];
    }

    return result;
  }, {});
}
