import isObject from './isObject';

/** 检测传入参数是否是空对象
 * @category Util
 * @param {*} arg 传入参数
 * @returns {Boolean} 是否是空对象
 * @function isEmptyObject
 * @example
 * isEmptyObject({}) //=> true
 */
export default function isEmptyObject(arg) {
  if (isObject(arg)) {
    for (var key in arg) {
      if (hasOwnProperty.call(arg, key)) {
        return false;
      }
    }
    return true;
  }
  return false;
}