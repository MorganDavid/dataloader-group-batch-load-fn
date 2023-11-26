// @ts-check

/**
 * @template TKey
 * @param {ReadonlyArray<TKey>} collection The collection to iterate over.
 * @param {(key:TKey) => object} iteratee The iteratee to transform keys.
 * @returns {Record<string, ReadonlyArray<{index:number, key:TKey}>>} Returns the composed aggregate object.
 */
export function groupBy(collection, iteratee) {
  if (typeof collection !== "object" || !collection?.length) return {};

  /**
   * @type {Record<string, ReadonlyArray<{index:number, key:TKey}>>}
   */
  const grouped = collection.reduce((result, value, index) => {
    const key = iteratee(value);
    const existing = result[key];
    if (existing) {
      existing.push({ index, key: value });
    } else {
      result[key] = [{ index, key: value }];
    }

    return result;
  }, {});

  return grouped;
}
