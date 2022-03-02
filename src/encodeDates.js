import each from './each';
import isDate from './isDate';
import isObject from './isObject';
import formatDate from './formatDate';

/** 将传入对象中的所有 Date 类型的值转换为格式为 YYYY-MM-DD HH:MM:SS.sss
 * 的字符串
 * @param {Object} obj 传入的对象
 * @returns {String} 传入对象，所有原有 Date 类型的值均已转换为 格式为 YYYY-MM-DD HH:MM:SS.sss 的字符串
 * @category Util
 * @function encodeDates
 * @example
 * var v =  encodeDates(
 * {
 *   a:new Date('2020-02-02 8:0:12')
 * }) 
 * v //=> {a: '2020-02-02 08:00:12.00'}
 */
export default function encodeDates(obj) {
  each(obj, function (v, k) {
    if (isDate(v)) {
      obj[k] = formatDate(v);
    } else if (isObject(v)) {
      obj[k] = encodeDates(v); // recurse
    }
  });
  return obj;
}