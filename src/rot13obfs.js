/** 对传入字符串进行 rot13 加密
 * @category Encoding
 * @param {String} str 传入字符串
 * @returns {String} 进行 rot13 加密后的字符串
 * @function rot13obfs
 * @example
 * rot13obfs('hello') //=> 'uryy|'
 */
export default function rot13obfs(str, key) {
  str = String(str);
  key = typeof key === 'number' ? key : 13;
  var n = 126;

  var chars = str.split('');

  for (var i = 0, len = chars.length; i < len; i++) {
    var c = chars[i].charCodeAt(0);

    if (c < n) {
      chars[i] = String.fromCharCode((chars[i].charCodeAt(0) + key) % n);
    }
  }

  return chars.join('');
}
