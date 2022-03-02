import each from './each';

/** 将传入对象中所有属性的值通过一个数组返回
 * @category Array
 * @param {*} obj 传入对象
 * @returns {Array} 一个包含了传入对象所有属性值的数组
 * @function values
 * 
 * @example
 * var a={
 *  a:1,
 *  b:2,
 *  c:'hello'
 * }
 * var b = values (a)
 * b //=> [1,2,'hello']
 */
export function values(obj) {
  var results = [];
  if (obj == null) {
    return results;
  }
  each(obj, function (value) {
    results[results.length] = value;
  });
  return results;
}