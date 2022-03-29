import each from './each';
var hasOwnProperty = Object.prototype.hasOwnProperty;
/** 使用源对象对目标对象进行扩展,
 * 只扩展第一层,<br>
 * 如果遇到目标对象已经存在的属性，则直接覆盖目标对象原来的属性值
 * @param {Object} obj 目标扩展对象
 * @param {Object} ext 源对象
 * @returns 扩展后的目标对象
 * @function extend
 * @category Util
 * 
 * @example 
 * var a = {
 *   name:'Alice',
 *   age:18,
 *   address:{
 *     addr1: 'BeiJing' 
 *   }
 *  }
 *  
 *  var b = {
 *   name: 'Bob',
 *   favor: 'Apple',
 *   address:{
 *     addr1: 'TianJing'
 *   }
 *  }
 *  
 *  extend(a,b);
 *  a //=> 
 *  // {
 *  //    name: "Bob",
 *  //    age: 18,
 *  //    favor: "Apple",
 *  //    address:{
 *  //      addr1: 'TianJing'
 *  //    }
 *  //  }
 * 
 */
export default function extend(obj) {
  each(Array.prototype.slice.call(arguments, 1), function (source) {
    for (var prop in source) {
      if (hasOwnProperty.call(source, prop) && source[prop] !== void 0) {
        obj[prop] = source[prop];
      }
    }
  });
  return obj;
}