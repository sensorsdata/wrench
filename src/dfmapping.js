/** 对输入字符串进行乱序混淆，对混淆后的结果再次执行该方法则返回原来输入的值，
 * 只支持大小写字母和数字，其他符号将不作处理
 * @param {String} str 输入字符串
 * @returns 混淆后的值
 * @category Encoding
 * @function dfmapping
 * 
 * @example
 * dfmapping('hello world') //=> 'zrkkm MmekV'
 * dfmapping('zrkkm MmekV') //=> 'hello world'
 * 
 */
export default function dfmapping(str) {
  var dfk = 't6KJCZa5pDdQ9khoEM3Tj70fbP2eLSyc4BrsYugARqFIw1mzlGNVXOHiWvxUn8';
  var len = dfk.length - 1;
  var relation = {};
  var i = 0;
  for (i = 0; i < dfk.length; i++) {
    relation[dfk.charAt(i)] = dfk.charAt(len - i);
  }
  var newStr = '';
  for (i = 0; i < str.length; i++) {
    if (str.charAt(i) in relation) {
      newStr += relation[str.charAt(i)];
    } else {
      newStr += str.charAt(i);
    }
  }
  return newStr;
}