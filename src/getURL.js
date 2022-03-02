import isString from './isString';
import trim from './tirm';
import _decodeURI from './_decodeURI';

/** 对传入的 url 字符串进行头尾空格去除，并进行 decodeURI 解码<br>
 * 若未传入 url 则对当前页面的地址进行 decodeURI 解码并返回
 * @param {String} ?url 传入 url 字符串
 * @returns 返回解码后的 url 或 decodeURI 解码后的当前页面地址
 * @category Bom
 * @function getURL
 * 
 * @example
 * // 在 https://www.example.com
 * getURL() //=> https://www.example.com
 */
export default function getURL(url) {
  if (isString(url)) {
    url = trim(url);
    return _decodeURI(url);
  } else {
    return _decodeURI(location.href);
  }
}