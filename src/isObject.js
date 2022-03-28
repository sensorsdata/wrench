/** 检测传入参数是否是对象类型
 * @category Util
 * @param {*} arg 传入参数
 * @returns {Boolean} 是否是对象类型
 * @function isObject
 * @example 
 * isObject({}) //=> true
 * isObject(1) //=> false
 */
export default function isObject(arg) {
  if (arg == null) {
    return false;
  } else {
    return Object.prototype.toString.call(arg) == '[object Object]';
  }
}