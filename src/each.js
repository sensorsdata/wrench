import isArray from './isArray';

var nativeForEach = Array.prototype.forEach;

/** 迭代器回调
 * @callback iteratorCallback
 * @param {*} value 当前迭代值
 * @param {Number} index 当前迭代值的下标
 * @param {Object} sourceArray 迭代源数组或对象
 */

/** 对传入数组或对象的每个属性应用迭代器方法进行执行，
 * @param {Object|Array} obj 传入对象
 * @param {iteratorCallback} iterator 迭代器方法
 * @param {Object} context 迭代器方法的执行上下文
 * @category Array
 * @function each
 *
 * @example
 * each([1,2,3],function(v,i,arr){console.log(v,i,arr)})
 * //1,0,[1, 2, 3]
 * //2,1,[1, 2, 3]
 * //3,2,[1, 2, 3]
 *
 */
export default function each(obj, iterator, context) {
  if (obj == null) {
    return false;
  }
  if (nativeForEach && obj.forEach === nativeForEach) {
    obj.forEach(iterator, context);
  } else if (isArray(obj)) {
    for (var i = 0, l = obj.length; i < l; i++) {
      i in obj && iterator.call(context, obj[i], i, obj);
    }
  } else {
    for (var key in obj) {
      if (hasOwnProperty.call(obj, key)) {
        iterator.call(context, obj[key], key, obj);
      }
    }
  }
}
