import each from './each';

/** 使用源对象对目标对象进行扩展，
 * 如果目标已经有该属性则不覆盖,如果没有的属性加进来
 * @param {Object} obj 目标扩展对象
 * @param {Object} ext 源对象
 * @returns 扩展后的目标对象
 * @function coverExtend
 * @category Util
 * 
 * @example
 * var a = {
 *  name:'Alice',
 *  age:18
 * }
 * 
 * var b = {
 *  name: 'Bob',
 *  favor: 'Apple'
 * }
 * 
 * coverExtend(a,b);
 * a //=> { name: "Alice",age: 18,favor: "Apple"}
 * b //=> { name:'Bob',favor:'Apple'}
 */
export default function coverExtend(obj) {
  each(Array.prototype.slice.call(arguments, 1), function (source) {
    for (var prop in source) {
      if (source[prop] !== void 0 && obj[prop] === void 0) {
        obj[prop] = source[prop];
      }
    }
  });
  return obj;
}
