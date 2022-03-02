/**
 * @callback filterCallback filter 过滤函数
 * @param {Object} value 数组中的一项数据
 * @param {Number} index 该项数据的下标
 * @param {Array} sourceArray 源数组
 * @returns {Boolean} 是否通过校验，返回 true 则该数据项会被进入 filter 函数返回的新数组中，否则不会
 */

/** 使用指定过滤函数在指定源数组每一项上执行，返回一个新的数组包含指定过滤函数返回真值的数组项
 * 
 * @param {Array} arr 指定源数组
 * @param {filterCallback} fn 指定过滤函数
 * @param {Object}  context 指定过滤函数执行上下文
 * @returns {Array} 新的数组，包含指定过滤函数值行返回真值的源数组项
 * @category Array
 * @function filter
 * 
 * @example
 * filter([1,2,3,4,5,6],
 * function(v,i,arr)
 * { 
 *   console.log(v,i,arr); 
 *    return v>=4
 * });
 * //=>
 * // 1 0 [1, 2, 3, 4, 5, 6]
 * // 2 1 [1, 2, 3, 4, 5, 6]
 * // 3 2 [1, 2, 3, 4, 5, 6]
 * // 4 3 [1, 2, 3, 4, 5, 6]
 * // 5 4 [1, 2, 3, 4, 5, 6]
 * // 6 5 [1, 2, 3, 4, 5, 6]
 * // [4,5,6] // return value 
 */
export default function filter(arr, fn, context) {
  var hasOwn = Object.prototype.hasOwnProperty;
  if (arr.filter) {
    return arr.filter(fn);
  }
  var ret = [];
  for (var i = 0; i < arr.length; i++) {
    if (!hasOwn.call(arr, i)) {
      continue;
    }
    var val = arr[i];
    if (fn.call(context, val, i, arr)) {
      ret.push(val);
    }
  }
  return ret;
}
