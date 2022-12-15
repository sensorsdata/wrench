import getQueryParamsFromUrl from './getQueryParamsFromUrl';
import _URL from './URL';

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
  var urlParts = _URL(url);
  var result = urlParts.searchParams.get(key) || '';

  if (!result) {
    var hash = urlParts.hash;
    if (hash) {
      var results = getQueryParamsFromUrl(hash);
      result = results[key] || '';
    }
  }

  return result;
}
