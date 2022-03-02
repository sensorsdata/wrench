/** 对传入字符串进行安全的 JSON 反序列化操作，如果反序列化失败则返回 null
 * @category Encoding
 * @param {String} str 传入字符串
 * @returns {Object} 反序列化后的对象
 * @function safeJSONParse
 * 
 * @example
 * safeJSONParse('{\"a\":124}') //=> {a: 124}
 */
export default function safeJSONParse(str) {
  var val = null;
  try {
    val = JSON.parse(str);
    // eslint-disable-next-line no-empty
  } catch (e) { }
  return val;
}