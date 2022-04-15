import _decodeURI from './decodeURI';
import isString from './isString';
import trim from './trim';

/** 对传入的 url_path 字符串进行头尾空格去除，并进行 decodeURI 解码<br>
 * 若未传入 url_path 则对当前页面 URL 的路径部分进行 decodeURI 解码并返回
 * @param {String} ?url_path 传入 url_path 字符串
 * @returns 返回解码后的 url_path 或 decodeURI 解码后的当前页面 URL 的路径部分
 * @category Bom
 * @function getURLPath
 *
 * @example
 * // 在 "http://localhost:8080/世界.html"
 * getURLPath() //=> "/世界.html"
 */
export default function getURLPath(url_path) {
  if (isString(url_path)) {
    url_path = trim(url_path);
    return _decodeURI(url_path);
  } else {
    return _decodeURI(location.pathname);
  }
}
