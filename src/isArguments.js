var hasOwnProperty = Object.prototype.hasOwnProperty;

/**检测是否是函数内部 arguments 对象
 * @category Util
 * @param {*} arg 传入参数 
 * @returns {Boolean} 是否是函数内部 arguments 对象
 * @function isArguments
 * 
 * @example 
 * (
 * function(){
 * var v = isArguments(arguments); 
 * console.log(v) //=> true
 * }()
 * )
 */
export default function isArguments(arg) {
  return !!(arg && hasOwnProperty.call(arg, 'callee'));
}