import _decodeURIComponent from './_decodeURIComponent';

/** 获取 url 中指定查询参数的值
 * 
 * @param {String} url 传入 url
 * @param {String} key 指定需要获取的查询参数的 key
 * @returns {String} url 查询参数中指定 key 的值
 * @function getQueryParam
 * @category Bom
 * @example
 * var val = getQueryParam('https://a.b.com?a=1&b=2','b');
 * console.log(val); // => 2
 */
export default function getQueryParam(url, key) {
  //eslint-disable-next-line
  key = key.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  url = _decodeURIComponent(url);
  var regexS = '[\\?&]' + key + '=([^&#]*)',
    regex = new RegExp(regexS),
    results = regex.exec(url);
  if (results === null || (results && typeof results[1] !== 'string' && results[1].length)) {
    return '';
  } else {
    return _decodeURIComponent(results[1]);
  }
}