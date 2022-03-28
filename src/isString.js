/** 检测传入参数是否是字符串
 * 
 * @param {*} arg 传入参数
 * @returns {Boolean} 是否是字符串
 * @category Util
 * @function isString
 * @example
 * isString('1234') //=> true
 */
export default function isString(arg) {
  return Object.prototype.toString.call(arg) == '[object String]';
}