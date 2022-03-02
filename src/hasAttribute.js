/** 检测是否具有指定属性名的属性
 * @category Dom
 * @param {Element} ele 传入 dom 元素
 * @param {String} attrName 属性名
 * @returns {Boolean} 是否具有指定属性名的属性
 * @function hasAttribute
 * 
 * @example
 * var d = document.getElementById('sp1'); //<div id='sp1' test='123'></div>
 * hasAttribute(d,'test') //=> true
 */
export default function hasAttribute(ele, attrName) {
  if (ele.hasAttribute) {
    return ele.hasAttribute(attrName);
  } else if (ele.attributes) {
    return !!(ele.attributes[attrName] && ele.attributes[attrName].specified);
  }
}