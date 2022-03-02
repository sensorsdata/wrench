/** base64 编码码，该方法会自动处理 Unicode 字符，
 * 对等的应使用 base64Decode 方法进行解码
 * @param {*} str 传入待编码字符串
 * @function base64Encode
 * @category Encoding
 * @returns base64 编码后的字符串
 * 
 * @example
 * base64Encode('hello世界') //=> 'aGVsbG/kuJbnlYw='
 */
export default function base64Encode(str) {
  var result = '';
  try {
    result = btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
        return String.fromCharCode('0x' + p1);
      })
    );
  } catch (e) {
    result = str;
  }
  return result;
}