import rot13obfs from './rot13obfs';

/**
 * 对传入字符串进行 rot13 解密
 * @function rot13defs
 * @category Encoding
 * @param {String} str 传入待加密的字符串
 * @return {String} rot13 解密后的字符串
 * 
 * @example
 * rot13defs('uryy|') //=> hello
 */
export default function rot13defs(str) {
  var key = 13,
    n = 126;
  str = String(str);

  return rot13obfs(str, n - key);
}
