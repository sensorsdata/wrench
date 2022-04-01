import isElement from './isElement';
import isUndefined from './isUndefined';
import isArray from './isArray';

/**
 * @typedef {Object} DomElementInfo 包含了 Dom 信息获取和设置方法的对象
 * @property {Function} addClass <strong>addClass (className:String)->void</strong><br>为 Dom 元素添加样式类名
 * @property {Function} removeClass <strong>removeClass(className:String)->void</strong><br>为 Dom 元素删除样式类名
 * @property {Function} hasClass <strong>hasClass(className:String)->Boolean </strong><br>检测 Dom 元素是否具有指定样式类名
 * @property {Function} attr <strong>attr(key:String,?value:String)->String|null </strong><br>获取和设置 Dom 元素属性。当只传 key 不传 value 时，方法获取元素中名为 key 的属性值。当传了 key 和 value 时，方法为 dom 元素设置名为 key 值为 value 的属性。
 * @property {Function} offset <strong>offset()->{left:Number,top:Number} </strong><br>获取 Dom 元素相对浏览器窗口左上角的偏移位置
 * @property {Function} getSize <strong>getSize()->{width:NUmber, height:Number} </strong><br>获取 Dom 元素的宽高
 * @property {Function} getStyle <strong>getStyle(property:String)->String </strong><br>获取 Dom 元素的指定样式的值，如: getStyle('width')
 */

/**
 * @category Dom
 * @param {Element} dom 传入的 dom 元素
 * @returns {DomElementInfo} 元素信息对象，用于获取元素信息
 * @function ry
 * @example
 * var a =  document.getElementById('banner');
 * var b =ry(a);
 * b.addClass('banner-style');
 * // => <h1 id='banner' class='banner-style'> hello world </h1>
 */
export default function ry(dom) {
  return new DomElementInfo(dom);
}

var DomElementInfo = function (dom) {
  this.ele = dom;
};

var siblings = function (n, elem) {
  var matched = [];

  for (; n; n = n.nextSibling) {
    if (n.nodeType === 1 && n !== elem) {
      matched.push(n);
    }
  }

  return matched;
};

DomElementInfo.prototype = {
  addClass: function (para) {
    var classes = ' ' + this.ele.className + ' ';
    if (classes.indexOf(' ' + para + ' ') === -1) {
      this.ele.className = this.ele.className + (this.ele.className === '' ? '' : ' ') + para;
    }
    return this;
  },
  removeClass: function (para) {
    var classes = ' ' + this.ele.className + ' ';
    if (classes.indexOf(' ' + para + ' ') !== -1) {
      this.ele.className = classes.replace(' ' + para + ' ', ' ').slice(1, -1);
    }
    return this;
  },
  hasClass: function (para) {
    var classes = ' ' + this.ele.className + ' ';
    if (classes.indexOf(' ' + para + ' ') !== -1) {
      return true;
    } else {
      return false;
    }
  },
  attr: function (key, value) {
    if (typeof key === 'string' && isUndefined(value)) {
      return this.ele.getAttribute(key);
    }
    if (typeof key === 'string') {
      value = String(value);
      this.ele.setAttribute(key, value);
    }
    return this;
  },
  offset: function () {
    var rect = this.ele.getBoundingClientRect();
    if (rect.width || rect.height) {
      var doc = this.ele.ownerDocument;
      var docElem = doc.documentElement;

      return {
        top: rect.top + window.pageYOffset - docElem.clientTop,
        left: rect.left + window.pageXOffset - docElem.clientLeft
      };
    } else {
      return {
        top: 0,
        left: 0
      };
    }
  },
  getSize: function () {
    if (!window.getComputedStyle) {
      return { width: this.ele.offsetWidth, height: this.ele.offsetHeight };
    }
    try {
      var bounds = this.ele.getBoundingClientRect();
      return { width: bounds.width, height: bounds.height };
    } catch (e) {
      return { width: 0, height: 0 };
    }
  },
  getStyle: function (value) {
    if (this.ele.currentStyle) {
      return this.ele.currentStyle[value];
    } else {
      return this.ele.ownerDocument.defaultView.getComputedStyle(this.ele, null).getPropertyValue(value);
    }
  },
  wrap: function (elementTagName) {
    var ele = document.createElement(elementTagName);
    this.ele.parentNode.insertBefore(ele, this.ele);
    ele.appendChild(this.ele);
    return ry(ele);
  },
  getCssStyle: function (prop) {
    var result = this.ele.style.getPropertyValue(prop);
    if (result) {
      return result;
    }
    var rules = null;
    if (typeof window.getMatchedCSSRules === 'function') {
      rules = window.getMatchedCSSRules(this.ele);
    }
    if (!rules || !isArray(rules)) {
      return null;
    }
    for (var i = rules.length - 1; i >= 0; i--) {
      var r = rules[i];
      result = r.style.getPropertyValue(prop);
      if (result) {
        return result;
      }
    }
  },
  sibling: function (cur, dir) {
    //eslint-disable-next-line
    while ((cur = cur[dir]) && cur.nodeType !== 1) {}
    return cur;
  },
  next: function () {
    return this.sibling(this.ele, 'nextSibling');
  },
  prev: function () {
    return this.sibling(this.ele, 'previousSibling');
  },
  siblings: function () {
    return siblings((this.ele.parentNode || {}).firstChild, this.ele);
  },
  children: function () {
    return siblings(this.ele.firstChild);
  },
  parent: function () {
    var parent = this.ele.parentNode;
    parent = parent && parent.nodeType !== 11 ? parent : null;
    return ry(parent);
  },
  // 兼容原生不支持 previousElementSibling 的旧版浏览器
  previousElementSibling: function () {
    var el = this.ele;
    if ('previousElementSibling' in document.documentElement) {
      return ry(el.previousElementSibling);
    } else {
      while ((el = el.previousSibling)) {
        if (el.nodeType === 1) {
          return ry(el);
        }
      }
      return ry(null);
    }
  },
  // 得到和当前元素相同类型的同级元素
  getSameTypeSiblings: function () {
    var element = this.ele;
    var parentNode = element.parentNode;
    var tagName = element.tagName.toLowerCase();
    var arr = [];
    for (var i = 0; i < parentNode.children.length; i++) {
      var child = parentNode.children[i];
      if (child.nodeType === 1 && child.tagName.toLowerCase() === tagName) {
        arr.push(parentNode.children[i]);
      }
    }
    return arr;
  },
  //获取元素 path
  getParents: function () {
    try {
      var element = this.ele;
      if (!isElement(element)) {
        return [];
      }
      var pathArr = [element];
      if (element === null || element.parentElement === null) {
        return [];
      }
      while (element.parentElement !== null) {
        element = element.parentElement;
        pathArr.push(element);
      }
      return pathArr;
    } catch (err) {
      return [];
    }
  }
};
