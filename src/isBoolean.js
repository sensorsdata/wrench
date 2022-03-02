/**检测是否是布尔值
 * @category Util
 * @param {*} arg 传入参数
 * @returns {Boolean} 是否是布尔类型
 * @function isBoolean
 * 
 * @example
 * isBoolean(true) //=> true
 */
export default function isBoolean(arg) {
  return toString.call(arg) == '[object Boolean]';
}