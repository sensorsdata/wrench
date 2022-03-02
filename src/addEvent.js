import ry from './ry';

/** 兼容低版本 IE 的事件注册方法
 * @category Event
 * @param {HTMLElement|Window} target 事件源，window 或 DOM 元素
 * @param {String} eventName 事件名，如 load、click、mousedown
 * @param {Function} evenHandler 事件处理函数
 * @param {Boolean} ?useCapture 是否使用事件捕获、默认值为 true
 * @example
 * addEvent(window, 'hashchange', function(){
 *  console.log('hash changed.');
 * };
 * @function addEvent
 */
export default function addEvent(target, eventName, evenHandler, useCapture) {
  function fixEvent(event) {
    if (event) {
      event.preventDefault = fixEvent.preventDefault;
      event.stopPropagation = fixEvent.stopPropagation;
      event._getPath = fixEvent._getPath;
    }
    return event;
  }
  fixEvent._getPath = function () {
    var ev = this;
    return this.path || (this.composedPath && this.composedPath()) || ry(ev.target).getParents();
  };

  fixEvent.preventDefault = function () {
    this.returnValue = false;
  };
  fixEvent.stopPropagation = function () {
    this.cancelBubble = true;
  };

  var register_event = function (element, type, handler) {
    if (useCapture === undefined && type === 'click') {
      useCapture = true;
    }
    if (element && element.addEventListener) {
      element.addEventListener(
        type,
        function (e) {
          e._getPath = fixEvent._getPath;
          handler.call(this, e);
        },
        useCapture
      );
    } else {
      var ontype = 'on' + type;
      var old_handler = element[ontype];
      element[ontype] = makeHandler(element, handler, old_handler, type);
    }
  };
  function makeHandler(element, new_handler, old_handlers, type) {
    var handler = function (event) {
      event = event || fixEvent(window.event);
      if (!event) {
        return undefined;
      }
      event.target = event.srcElement;

      var ret = true;
      var old_result, new_result;
      if (typeof old_handlers === 'function') {
        old_result = old_handlers(event);
      }
      new_result = new_handler.call(element, event);
      // ie浏览器在 beforeunload时不能用返回值 如有返回 会自动弹出一个系统弹窗
      if (type !== 'beforeunload') {
        if (false === old_result || false === new_result) {
          ret = false;
        }
        return ret;
      }
    };
    return handler;
  }

  register_event.apply(null, arguments);
}