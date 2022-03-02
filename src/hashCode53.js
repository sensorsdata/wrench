/** 对传入字符串进行 hash 计算，哈希值范围为 JS 可表示的安全值范围 ±9E15
 * @category Encoding
 * @param {String} str 传入字符串
 * @returns {Number} 传入字符串的哈希值
 * @function hashCode53
 * 
 * @example
 * hashCode53('hello world') //=> -5975507814869267
 */
export default function hashCode53(str) {
  var max53 = 9007199254740992;
  var min53 = -9007199254740992;
  var factor = 31;
  var hash = 0;
  if (str.length > 0) {
    var val = str.split('');
    for (var i = 0; i < val.length; i++) {
      var aVal = val[i].charCodeAt();
      var nextHash = factor * hash + aVal;
      if (nextHash > max53) {
        hash = min53 + hash;
        while (((nextHash = factor * hash + aVal), nextHash < min53)) {
          hash = hash / 2 + aVal;
        }
      }
      if (nextHash < min53) {
        hash = max53 + hash;
        while (((nextHash = factor * hash + aVal), nextHash > max53)) {
          hash = hash / 2 + aVal;
        }
      }
      hash = factor * hash + aVal;
    }
  }
  return hash;
}