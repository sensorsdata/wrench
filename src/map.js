import each from './each';

/** 对传入数组的每个值执行映射方法，并返映射后值一个新的数组
 * 
 * @param {Array} obj 传入对象
 * @param {iteratorCallback} iterator 迭代器映射方法
 * @returns 源数组每个元素执行映射方法后的的结果组成的新数组
 * @category Array
 * @function map
 * @example
 * var v =map([1,2,3],function(v,i,arr){
 *   console.log(v,i,arr);
 *   return v+10;
 * })
 * // 1 0 [1, 2, 3]
 * // 2 1 [1, 2, 3]
 * // 3 2 [1, 2, 3]
 * v // [11,12,13]
 */
export default function map(obj, iterator) {
  var results = [];
  // Not using strict equality so that this acts as a
  // shortcut to checking for `null` and `undefined`.
  if (obj == null) {
    return results;
  }
  if (Array.prototype.map && obj.map === Array.prototype.map) {
    return obj.map(iterator);
  }
  each(obj, function (value, index, list) {
    results.push(iterator(value, index, list));
  });
  return results;
}