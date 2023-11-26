export { groupBatchLoadFn } from "./groupBatchLoadFn";

/**
 * @template TKey, TValue
 * @callback BatchLoadFn
 * @param {ReadonlyArray<TKey>} keys
 * @returns {PromiseLike<ArrayLike<TValue | Error>>}
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
