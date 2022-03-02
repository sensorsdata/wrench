import hasAttribute from './hasAttribute';
import isArray from './isArray';

/** 检测传入 Dom 元素是否具有指定属性名数组中有至少一个属性
 * @category Dom
 * @param {Element} ele 传入 Dom 元素
 * @param {Array} attrNames 传入属性名字符串数组
 * @returns Dom 元素是否具有指定属性名数组中有至少一个属性
 * @function hasAttributes
 * 
 * @example
 * var d = document.getElementById('sp1'); //<div id='sp1' test='123' test2='345'></div>
 * hasAttribute(d,['test']) //=> true
 */
export default function hasAttributes(ele, attrNames) {
  if (typeof attrNames === 'string') {
    return hasAttribute(ele, attrNames);
  } else if (isArray(attrNames)) {
    var result = false;
    for (var i = 0; i < attrNames.length; i++) {
      var testResult = hasAttribute(ele, attrNames[i]);
      if (testResult) {
        result = true;
        break;
      }
    }
    return result;
  }
}