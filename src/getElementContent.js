import trim from './trim';

/** 获取元素的文本内容
 * 
 * @param {Element} element dom 元素
 * @param {String} tagName 元素的标签名
 * @returns {String} 元素文本内容
 * @function getElementContent
 * @category Dom
 * 
 * @example
 * var button = document.getElementById('btn1'); // <button id='btn1'>test</button>
 * getElementContent(button,'button'); //=> test
 */
export default function getElementContent(element, tagName) {
  var textContent = '';
  var element_content = '';
  if (element.textContent) {
    textContent = trim(element.textContent);
  } else if (element.innerText) {
    textContent = trim(element.innerText);
  }
  if (textContent) {
    textContent = textContent
      .replace(/[\r\n]/g, ' ')
      .replace(/[ ]+/g, ' ')
      .substring(0, 255);
  }
  element_content = textContent || '';

  if (tagName === 'input' || tagName === 'INPUT') {
    element_content = element.value || '';
  }
  return element_content;
}