import each from './each';
import isDate from './isDate';
import isObject from './isObject';
import formatDate from './formatDate';
import isArray from './isArray';

/** 将传入对象中的所有 Date 类型的值转换为格式为 YYYY-MM-DD HH:MM:SS.sss
 * 的字符串
 * 
 * @param {Object} obj 传入对象
 * @returns {String} 传入对象，所有原有 Date 类型的值均已转换为 格式为 YYYY-MM-DD HH:MM:SS.sss 的字符串
 * @category Util
 * @function searchObjDate
 * @example
 * var v =  encodeDates(
 * {
 *   a:new Date('2020-02-02 8:0:12')
 * }) 
 * v //=> {a: '2020-02-02 08:00:12.00'}
 */
export default function searchObjDate(o) {
  if (isObject(o) || isArray(o)) {
    each(o, function (a, b) {
      if (isObject(a) || isArray(a)) {
        searchObjDate(o[b]);
      } else {
        if (isDate(a)) {
          o[b] = formatDate(a);
        }
      }
    });
  }
}