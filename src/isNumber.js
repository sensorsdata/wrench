/** 检测传入参数是否是数字
 * @category Util
 * @param {*} arg 传入参数
 * @returns {Boolean} 是否是数字类型
 * @function isNumber
 * 
 * @example
 * isNumber(1234) //=> true
 */
export default function isNumber(arg) {
  /* eslint-disable-next-line */
  return toString.call(arg) == '[object Number]' && /[\d\.]+/.test(String(arg));
}