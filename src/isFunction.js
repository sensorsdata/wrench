/** 检测传入参数是否是函数
 * @category Util
 * @param {*} arg 传入参数
 * @returns 是否是函数
 * @function isFunction
 * @example 
 * isFunction (function(){}) //=> true
 */
export default function isFunction(arg) {
  if (!arg) {
    return false;
  }
  var type = toString.call(arg);
  return type == '[object Function]' || type == '[object AsyncFunction]';
}