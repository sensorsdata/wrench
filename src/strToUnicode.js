/** 将传入字符串转换为 unicode 编码
 * @category Encoding
 * @param {String} str 传入字符串
 * @returns {String} 传入字符串的 unicode 编码
 * @function strToUnicode
 * @example 
 * strToUnicode('hello 世界') // => '\\68\\65\\6c\\6c\\6f\\20\\4e16\\754c'
 */
export default function strToUnicode(str) {
  if (typeof str !== 'string') {
    console.log('转换unicode错误', str);
    return str;
  }
  var nstr = '';
  for (var i = 0; i < str.length; i++) {
    nstr += '\\' + str.charCodeAt(i).toString(16);
  }
  return nstr;
}
