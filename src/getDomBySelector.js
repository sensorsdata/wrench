import isString from './isString';
import trim from './trim';
import isElement from './isElement';

/** 通过选择器获取 dom 元素
 * 
 * @param {String} selector 选择器
 * @returns {Element} 与选择器匹配的 dom 元素
 * @category Dom
 * @function getDomBySelector
 */
export default function getDomBySelector(selector) {
  if (!isString(selector)) {
    return null;
  }
  var arr = selector.split('>');
  var el = null;

  function getDom(selector, parent) {
    selector = trim(selector);
    var node;
    if (selector === 'body') {
      return document.getElementsByTagName('body')[0];
    }
    if (selector.indexOf('#') === 0) {
      //如果是id选择器 #login
      selector = selector.slice(1);
      node = document.getElementById(selector);
    } else if (selector.indexOf(':nth-of-type') > -1) {
      //div:nth-of-type(1)
      var arr = selector.split(':nth-of-type');
      if (!(arr[0] && arr[1])) {
        //格式不正确，返回空
        return null;
      }
      var tagname = arr[0];
      var indexArr = arr[1].match(/\(([0-9]+)\)/);
      if (!(indexArr && indexArr[1])) {
        //没有匹配到正确的标签序号，返回空
        return null;
      }
      var num = Number(indexArr[1]); //标签序号
      if (!(isElement(parent) && parent.children && parent.children.length > 0)) {
        return null;
      }
      var child = parent.children;

      for (var i = 0; i < child.length; i++) {
        if (isElement(child[i])) {
          var name = child[i].tagName.toLowerCase();
          if (name === tagname) {
            num--;
            if (num === 0) {
              node = child[i];
              break;
            }
          }
        }
      }
      if (num > 0) {
        //子元素列表中未找到
        return null;
      }
    }
    if (!node) {
      return null;
    }
    return node;
  }

  function get(parent) {
    var tagSelector = arr.shift();
    var element;
    if (!tagSelector) {
      return parent;
    }
    try {
      element = getDom(tagSelector, parent);
    } catch (error) {
      console.log(error);
    }
    if (!(element && isElement(element))) {
      return null;
    } else {
      return get(element);
    }
  }
  el = get();
  if (!(el && isElement(el))) {
    return null;
  } else {
    return el;
  }
}