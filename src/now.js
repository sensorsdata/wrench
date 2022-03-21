import isFunction from './isFunction';
/** 获取当前时间相对于 1970-01-01 00:00:00 经过的毫秒数
 * @category Util
 * @function now
 * @returns {Number} 返回当前时间相对于 1970-01-01 00:00:00 经过的毫秒数
 * @example 
 * now() // 1646122486530
 */
export default function now() {
  if (Date.now && isFunction(Date.now)) {
    return Date.now();
  }
  return new Date().getTime();
}