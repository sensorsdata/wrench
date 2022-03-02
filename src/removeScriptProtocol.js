/** 删除传入字符串开头的 'javascript'
 * 
 * @param {String} str 传入字符串
 * @returns 删除字符串头部 'javascript' 后的字符串
 * 
 * @example
 * removeScriptProtocol('javascript:alert(123)');//=>':alert(123)'
 */
export default function removeScriptProtocol(str) {
  if (typeof str !== 'string') return '';
  var _regex = /^\s*javascript/i;
  while (_regex.test(str)) {
    str = str.replace(_regex, '');
  }
  return str;
}