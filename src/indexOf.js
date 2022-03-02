/** 在指定数组中查找目标对象的位置，若没有找到则返回 -1
 * 
 * @param {Array} arr 传入数组
 * @param {Object} target 查找目标
 * @returns 查找目标的下标
 * @function indexOf
 * @category Array
 * 
 * @example
 * indexOf([1,2,3,4],2) //=> 1
 */
export default function indexOf(arr, target) {
  var indexof = arr.indexOf;
  if (indexof) {
    return indexof.call(arr, target);
  } else {
    for (var i = 0; i < arr.length; i++) {
      if (target === arr[i]) {
        return i;
      }
    }
    return -1;
  }
}