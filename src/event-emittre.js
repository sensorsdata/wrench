import { each } from './util';

/**
 * @class EventEmitter
 * @category Event
 * @example
 * var e = new EventEmitter()
 * e.on('HelloEvent',function(data){
 *  console.log('Hello Event happens',data);
 * })
 * 
 * e.emit('HelloEvent',123);
 * // Hello Event happens , 123
 */
var EventEmitter = function () {
  this._events = [];
  this.pendingEvents = [];
};

EventEmitter.prototype = {
  /** 派发事件
   * 
   * @param {String} type 事件名
   * @param {Object} data 事件数据
   */
  emit: function (type) {
    var args = [].slice.call(arguments, 1);

    each(this._events, function (val) {
      if (val.type !== type) {
        return;
      }
      val.callback.apply(val.context, args);
    });

    this.pendingEvents.push({
      type: type,
      data: args
    });
    this.pendingEvents.length > 20 ? this.pendingEvents.shift() : null;
  },

  /**
   * @callback eventEmitterCallback EventEmitter 事件回调
   * @param {Object} data 事件回调值 
   */

  /** 监听指定事件名的事件
   * @param {String} event 事件名
   * @param {eventEmitterCallback} callback 事件回调
   * @param {Object} context 回调执行上下文对象
   * @param {Boolean} replayAll 是否回放已经发生过的事件，最多 20 条
   */

  /**
   * 
   * @param {*} event 
   * @param {*} callback 
   * @param {*} context 
   * @param {*} replayAll 
   */

  on: function (event, callback, context, replayAll) {
    if (typeof callback !== 'function') {
      return;
    }
    this._events.push({
      type: event,
      callback: callback,
      context: context || this
    });

    replayAll = replayAll === false ? false : true;
    if (this.pendingEvents.length > 0 && replayAll) {
      each(this.pendingEvents, function (val) {
        if (val.type === event) {
          callback.apply(context, val.data);
        }
      });
    }
  },
  tempAdd: function (event, data) {
    if (!data || !event) {
      return;
    }
    return this.emit(event, data);
  },
  isReady: function () { }
};

export default EventEmitter;
