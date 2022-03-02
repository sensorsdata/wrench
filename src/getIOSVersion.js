/** 通过调用 Navigator.appVersion 获取 ios 系统版本号
 * @function getIOSVersion
 * @category Bom
 * @returns {String} IOS 设备的系统版本号,如果获取失败则返回空字符串
 */
export default function getIOSVersion() {
  try {
    var version = navigator.appVersion.match(/OS (\d+)[._](\d+)[._]?(\d+)?/);
    return version && version[1] ? Number.parseInt(version[1], 10) : '';
  } catch (e) {
    return '';
  }
}