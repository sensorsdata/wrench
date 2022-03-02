/** 对传入数组进行去重，返回新的数组
 * @category Array
 * @param {Array} arr 传入数组参数
 * @returns {Array} 去重后的数组
 * @function unique
 * 
 * @example
 * var a = [1,1,2,3,3,4,5]
 * var b = unique(a);
 * b //=> [1,2,3,4,5,]
 */
export default function unique(arr) {
  var temp,
    n = [],
    o = {};
  for (var i = 0; i < arr.length; i++) {
    temp = arr[i];
    if (!(temp in o)) {
      o[temp] = true;
      n.push(temp);
    }
  }
  return n;
}