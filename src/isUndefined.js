/** 检测传入参数是否等于 undefined
 * @category Util
 * @param {*} arg 传入参数
 * @returns {Boolean} 是否是 undefined 值
 * @function isUndefined
 * @example
 * isUndefined(undefined) //=> true
 * isUndefined(null) //=> false
 */
export default function isUndefined(arg) {
  return arg === void 0;
}
