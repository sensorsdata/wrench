/** 指定两个空格作为缩进，对传入对象进行 JSON 字符串转换
 * 
 * @param {Object} obj 传入对象
 * @returns 转换后的 JSON 字符串
 * @function formatJsonString
 * @category Encoding
 * @example 
 * formatJsonString({a:1}) // => '{\n  "a": 1\n}'
 */
export default function formatJsonString(obj) {
  try {
    return JSON.stringify(obj, null, '  ');
  } catch (e) {
    return JSON.stringify(obj);
  }
}