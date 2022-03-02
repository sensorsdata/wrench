/** 根据传入的 date 对象返回行如 YYYY-MM-DD HH:MM:SS.sss 的字符串，
 * 如：'2020-02-02 20:20:02.20'
 * @param {Date} date 传入的 date 对象
 * @returns 型如 YYYY-MM-DD:HH:MM:SS.ssssss 的字符串
 * @category Util
 * @function formatDate
 * @example 
 * formatDate(new Date('2020-2-2 8:0:12')) //=> '2020-02-02 08:00:12.00'
 */
export default function formatDate(date) {
  function pad(n) {
    return n < 10 ? '0' + n : n;
  }
  return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + ' ' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds()) + '.' + pad(date.getMilliseconds());
}