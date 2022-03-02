import _decodeURIComponent from './_decodeURIComponent';
/**
 * 解析传入查询参数到一个含有查询参数列表的 key/value 对象
 * @param {string} queryString - 以问号开头的查询参数字符串
 * @return {Object} 一个含有参数列表的 key/value 对象
 *
 * @example
 * var url = _.getURLSearchParams('?project=testproject&query1=test&silly=willy&field[0]=zero&field[2]=two#test=hash&chucky=cheese');
 *
 * url.project; // => testproject
 * @category Bom
 * @function getURLSearchParams
 */
export default function getURLSearchParams(queryString) {
  queryString = queryString || '';
  var args = {}; // Start with an empty object
  var query = queryString.substring(1); // Get query string, minus '?'
  var pairs = query.split('&'); // Split at ampersands
  for (var i = 0; i < pairs.length; i++) {
    // For each fragment
    var pos = pairs[i].indexOf('='); // Look for "name=value"
    if (pos === -1) continue; // If not found, skip it
    var name = pairs[i].substring(0, pos); // Extract the name
    var value = pairs[i].substring(pos + 1); // Extract the value
    name = _decodeURIComponent(name); // Decode the name
    value = _decodeURIComponent(value); // Decode the value
    args[name] = value; // Store as a property
  }
  return args; // Return the parsed arguments
}