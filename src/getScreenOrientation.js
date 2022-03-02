import mediaQueriesSupported from './mediaQueriesSupported';

/** 返回当前屏幕方向，可能值 ['未取到值', 'landscape', 'portrait']
  * 经过以下测试：<br>
  * IE 6 => '未取到值'<br>
  * Opera 15 on macOS<br>
  * Firefox 68 on macOS<br>
  * Safari 12.1 on macOS<br>
  * Chrome 75 on macOS<br>
  * Safari on iPhone X<br>
  * Chrome on Google Pixel 2<br>
  * @category Bom
  * @function getScreenOrientation
  * @returns 屏幕方向，可能值 ['未取到值', 'landscape', 'portrait']
  * @example getScreenOrientation() //=> 'landscape'
 */
export default function getScreenOrientation() {
  // Screen Orientation API
  var screenOrientationAPI = screen.msOrientation || screen.mozOrientation || (screen.orientation || {}).type;
  var screenOrientation = '未取到值';
  if (screenOrientationAPI) {
    screenOrientation = screenOrientationAPI.indexOf('landscape') > -1 ? 'landscape' : 'portrait';
  } else if (mediaQueriesSupported()) {
    // matchMedia
    var matchMediaFunc = window.matchMedia || window.msMatchMedia;
    if (matchMediaFunc('(orientation: landscape)').matches) {
      screenOrientation = 'landscape';
    } else if (matchMediaFunc('(orientation: portrait)').matches) {
      screenOrientation = 'portrait';
    }
  }
  return screenOrientation;
}