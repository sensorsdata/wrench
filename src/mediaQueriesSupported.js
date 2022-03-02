
/** 检测是否支持媒体查询
 * @function mediaQueriesSupported
 * @category Bom
 * @returns {Boolean}  是否支持媒体查询
 * @example
 * // 支持媒体查询的浏览器中
 * mediaQueriesSupported()// => true
 */
export default function mediaQueriesSupported() {
  return typeof window.matchMedia != 'undefined' || typeof window.msMatchMedia != 'undefined';
}