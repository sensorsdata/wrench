import isArray from './isArray';
import isArguments from './isArguments';
import values from './values';

/** 将传入的对象或类数组转换为数组
 * @category Array
 * @param {Array|Object} iterable 传入的对象或类数组
 * @returns {Array} 包含对象或类数组的成员的数组
 * @function toArray
 * @example
 * toArray({a:1,b:2})// =>[1, 2]
 * toArray([1,2]) // =>[1, 2]
 */
export default function toArray(iterable) {
  if (!iterable) {
    return [];
  }
  if (iterable.toArray) {
    return iterable.toArray();
  }
  if (isArray(iterable)) {
    return Array.prototype.slice.call(iterable);
  }
  if (isArguments(iterable)) {
    return Array.prototype.call(iterable);
  }
  return values(iterable);
}