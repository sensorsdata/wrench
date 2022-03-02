import isFunction from './isFunction';
import addEvent from './addEvent';

/**
 * @typedef listenPageStateArg 监听页面状态变化参数
 * @property {callback} visible 页面从不见到可见回调
 * @property {callback} hidden 页面从可见到不可见对调
 */

/** 监听页面状态变化，包括页面隐藏、显示、切换、获取焦点、丢失焦点<br>
 * 暴露 visible 和 hidden 回调，详细参见 listenPageStateArg <br>
 * <strong>触发 visible 回调的时机:</strong> 获取焦点、或 visibilitychange 事件发生且当前页面可见 <br>
 * <strong>触发 hidden 回调的时机:</strong>丢失焦点、或 visibilitychange 事件发生且当前页面不可见 <br>
 * @param {listenPageStateArg} obj 监听页面传参数、详细参见 listenPageStateArg
 * @category Event
 * @function listenPageState
 * 
 * @example
 * listenPageState({
 *  visible:function(){
 *   console.log('Page shows');
 *  },
 *  hidden:function(){
 *   console.log('Page hides');
 *  }
 * })
 */
export default function listenPageState(obj) {
  var visibilystore = {
    visibleHandler: isFunction(obj.visible) ? obj.visible : function () { },
    hiddenHandler: isFunction(obj.hidden) ? obj.hidden : function () { },
    visibilityChange: null,
    hidden: null,
    isSupport: function () {
      return typeof document[this.hidden] !== 'undefined';
    },
    init: function () {
      if (typeof document.hidden !== 'undefined') {
        this.hidden = 'hidden';
        this.visibilityChange = 'visibilitychange';
      } else if (typeof document.mozHidden !== 'undefined') {
        this.hidden = 'mozHidden';
        this.visibilityChange = 'mozvisibilitychange';
      } else if (typeof document.msHidden !== 'undefined') {
        this.hidden = 'msHidden';
        this.visibilityChange = 'msvisibilitychange';
      } else if (typeof document.webkitHidden !== 'undefined') {
        this.hidden = 'webkitHidden';
        this.visibilityChange = 'webkitvisibilitychange';
      }
      this.listen();
    },
    listen: function () {
      if (!this.isSupport()) {
        addEvent(window, 'focus', this.visibleHandler);
        addEvent(window, 'blur', this.hiddenHandler);
      } else {
        var _this = this;
        addEvent(
          document,
          this.visibilityChange,
          function () {
            if (!document[_this.hidden]) {
              _this.visibleHandler();
            } else {
              _this.hiddenHandler();
            }
          },
          1
        );
      }
    }
  };
  visibilystore.init();
}