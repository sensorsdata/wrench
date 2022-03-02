/** 检测传入字符串是否是 http 或 https 地址
 * @category Util
 * @param {String} str 传入字符串
 * @returns {Boolean} 是否是 http 或 https 地址
 * @function isHttpUrl
 * 
 * @example
 * isHttpUrl('https://www.example.com') //=> true
 */
export default function isHttpUrl(str) {
  if (typeof str !== 'string') return false;
  var _regex = /^https?:\/\/.+/;
  if (_regex.test(str) === false) {
    console.log('Invalid URL');
    return false;
  }
  return true;
}