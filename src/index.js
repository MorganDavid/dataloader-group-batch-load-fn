import { groupBatchLoadFn } from "./groupBatchLoadFn";

module.exports = { groupBatchLoadFn };

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
 * @param {Partial<TKey>} args
 * @returns {Promise<ArrayLike<TValue | Error>>}
 */
/**
 * @template TKey
 * @callback getArgs
 * @param {TKey} key
 * @returns {Partial<TKey>}
 */
/**
 * @template TKey
 * @typedef {Object} Options
 * @property {getArgs<TKey>} getArgs
 */
