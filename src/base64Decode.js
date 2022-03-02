import map from './map';
/** base64 解码，该方法会自动处理 Unicode 字符，
 * 对等的应使用 base64Encode 方法进行编码
 * @param {String} str 传入待解码字符串
 * @category Encoding
 * @function base64Decode
 * @returns 解码后的字符串
 * 
 * @example
 * base64Decode('aGVsbG/kuJbnlYw=')//=> 'hello世界'
 */
export default function base64Decode(str) {
  var arr = [];
  try {
    arr = map(atob(str).split(''), function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    });
  } catch (e) {
    arr = [];
  }

  try {
    return decodeURIComponent(arr.join(''));
  } catch (e) {
    return arr.join('');
  }
}