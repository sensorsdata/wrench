/** 对传入字符串做哈希计算,取值范围为 ±1E10
 * @category Encoding
 * @param {*} str 传入字符串 
 * @returns 传入字符串的 hash 值
 * @function hashCode 
 * 
 * @example
 * hasdCode('hello world') //=> 1794106052
 */
export default function hashCode(str) {
  if (typeof str !== 'string') {
    return 0;
  }
  var hash = 0;
  var char = null;
  if (str.length == 0) {
    return hash;
  }
  for (var i = 0; i < str.length; i++) {
    char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash;
}