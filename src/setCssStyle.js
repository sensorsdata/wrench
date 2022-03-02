/** 创建 style 标签，填入传入 css 样式字符串
 * @function setCssStyle
 * @category Dom
 * @param {String} css 传入样式字符串
 * @example 
 * setCssStyle(
 *  `body
 *   { 
 *     background :red
 *   }
 * `)
 * // html head 中将插入 
 * // <style>
 * //   body 
 * //   { 
 * //     background:red
 * //   }
 * // </style>
 */
export default function setCssStyle(css) {
  var style = document.createElement('style');
  style.type = 'text/css';
  try {
    style.appendChild(document.createTextNode(css));
  } catch (e) {
    style.styleSheet.cssText = css;
  }
  var head = document.getElementsByTagName('head')[0];
  var firstScript = document.getElementsByTagName('script')[0];
  if (head) {
    if (head.children.length) {
      head.insertBefore(style, head.children[0]);
    } else {
      head.appendChild(style);
    }
  } else {
    firstScript.parentNode.insertBefore(style, firstScript);
  }
}