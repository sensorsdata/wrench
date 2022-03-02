/**
 * @callback bindReadyCallback
 * @param {Event|String} e  DOMContentLoaded 或 readystatechange 时间回调参数<br>
 * 当页面已经加载完成时，e 的值为 'lazy' 字符串
 */


/** 监听页面加载完成，页面加载完成时执行回调。
 * 通过 <br>
 * 1. 监听 readystatechange 事件，在事件回调中检测当 readyState 值为 complete 时执行回调<br>
 * 2. 监听 DOMContentLoaded 事件，在事件回调中检测当 readyState 值为 complete 时执行回调<br>
 * 3. 监听 load 事件，在事件回调中检测当 readyState 值为 complete 时执行回调<br>
 * 三个监听任何一个达成回调值行逻辑后取消所有监听 <br>
 * 页面加载完成时调用该方法，会立刻回调，并收到 lazy 回调值
 * @param {bindReadyCallback} fn 页面加载完成回调
 * @param {Window} win 指定 Window
 * @function bindReady
 * @category Event
 * @example
 * bindReady(function()
 * {
 *    console.log('page load complete')
 * });
 */
export default function bindReady(fn, win) {
  win = win || window;
  var done = false,
    top = true,
    doc = win.document,
    root = doc.documentElement,
    modern = doc.addEventListener,
    add = modern ? 'addEventListener' : 'attachEvent',
    rem = modern ? 'removeEventListener' : 'detachEvent',
    pre = modern ? '' : 'on',
    init = function (e) {
      if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
      (e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
      if (!done && (done = true)) fn.call(win, e.type || e);
    },
    poll = function () {
      try {
        root.doScroll('left');
      } catch (e) {
        setTimeout(poll, 50);
        return;
      }
      init('poll');
    };

  if (doc.readyState == 'complete') fn.call(win, 'lazy');
  else {
    if (!modern && root.doScroll) {
      try {
        top = !win.frameElement;
      } catch (e) {
        console.log(e);
      }
      if (top) poll();
    }
    doc[add](pre + 'DOMContentLoaded', init, false);
    doc[add](pre + 'readystatechange', init, false);
    win[add](pre + 'load', init, false);
  }
}