/** 检测传入参数是否是合法 JSON 字符串
 * @category Util
 * @param {String} arg 传入字符串
 * @returns {Boolean} 是否是合法 JSON 字符串类型
 * @function isJSONString
 * @example
 * isJSONString("{\"a\":123}") //=> true
 */
export default function isJSONString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}