import each from './each';
import extend from './extend';
import isObject from './isObject';

/** 使用源对象对目标对象进行扩展,
 * 允许扩展到第二级
 * @param {Object} obj 目标扩展对象
 * @param {Object} ext 源对象
 * @returns 扩展后的目标对象
 * @function extend2Lev
 * @category Util
 * 
 * @example
 * var a = {
 *  name:'Alice',
 *  age:18,
 *  address:{
 *    addr1: 'BeiJing',
 *    addr2: 'HeiBei'
 *  }
 * }
 * 
 * var b = {
 *  name: 'Bob',
 *  favor: 'Apple',
 *  address:{
 *    addr1: 'TianJing'
 *  }
 * }
 * 
 * extend2Lev(a,b);
 * 
 * a //=>
 * //{ 
 * // name: 'Bob',
 * // age: 18,
 * // favor: 'Apple',
 * // address:{
 * //   addr1: 'TianJing'
 * //   addr2: 'HeiBei'
 * // }
 * //}
 */

export default function extend2Lev(obj) {
  each(Array.prototype.slice.call(arguments, 1), function (source) {
    for (var prop in source) {
      if (source[prop] !== void 0) {
        if (isObject(source[prop]) && isObject(obj[prop])) {
          extend(obj[prop], source[prop]);
        } else {
          obj[prop] = source[prop];
        }
      }
    }
  });
  return obj;
}
