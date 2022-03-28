/** 检测传入参数是否是日期对象
 * @category Util
 * @param {*} arg 传入参数
 * @returns {Boolean} 是否是日期类型
 * @function isDate
 * @example
 * isDate(new Date()) //=> true
 */
export default function isDate(arg) {
  return Object.prototype.toString.call(arg) == '[object Date]';
}
