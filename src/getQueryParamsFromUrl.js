import getURLSearchParams from './getURLSearchParams';

/**
 * 解析传入 url 中查询参数到一个含有查询参数列表的 key/value 对象
 * @param {string} url - 传入 url 字符串
 * @return {Object} 一个含有参数列表的 key/value 对象
 *
 * @example
 * var url = _.getQueryParamsFromUrl('https://a.b.com?project=testproject&query1=test&silly=willy&field[0]=zero&field[2]=two#test=hash&chucky=cheese');
 *
 * url.project; // => testproject
 * @category Bom
 * @function getQueryParamsFromUrl
 */

export default function getQueryParamsFromUrl(url) {
  var result = {};
  var arr = url.split('?');
  var queryString = arr[1] || '';
  if (queryString) {
    result = getURLSearchParams('?' + queryString);
  }
  return result;
}