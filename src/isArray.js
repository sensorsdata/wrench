import isFunction from './isFunction';
/** 检测传入参数是否是数组类型
 * @category Util
 * @param {*} arg 传入参数
 * @function isArray
 * @returns {Boolean} 是否是数组类型
 * 
 * @example 
 * isArray([])//=> true
 */
export default function isArray(arg) {
  if (Array.isArray && isFunction(isArray)) {
    return Array.isArray(arg);
  }
  return toString.call(arg) === '[object Array]';
}