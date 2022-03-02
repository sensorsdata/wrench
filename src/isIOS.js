/** 检测是否是 iOS 系统
 * @category Bom
 * @function isIOS
 * @returns {Boolean} 是否是 iOS 系统
 * 
 * @example
 * // 在 iOS 设备中
 * isIOS() //=> true
 */
export default function isIOS() {
  return !!navigator.userAgent.match(/iPhone|iPad|iPod/i);
}