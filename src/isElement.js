/** 检测传入参数是否一个 Dom 元素
 * 
 * @param {*} arg 传入参数
 * @returns {Boolean} 是否是 Dom 元素
 * @function isElement
 * @category Util
 * @example
 * var d = document.body;
 * isElement(d); //=> true
 */
export default function isElement(arg) {
  return !!(arg && arg.nodeType === 1);
}