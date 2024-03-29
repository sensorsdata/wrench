var logFn;

/** wrench 库的日志打印模块，可以通过 setup 设置自定义日志打印方式
 * @category Util
 * @exports logger
 */
export default {
  /** 自定义工具库的日志函数，默认使用控制台输出
   * 
   * @param {Function} logger 日志函数
   * @example
   * function myLog(arg){
   *    console.log(arg);
   *    alert(arg);
   * }
   * logger.setup(myLog); // 使用 myLog 作为日志输出 
   */
  setup: function (logger) {
    logFn = logger;
  },
  /**
   * 使用自定义的日志函数输出日志
   * 
   * @example
   * logger.log('hello world','1234');
   */
  log: function () {
    (logFn || (console && console.log) || function () { }).apply(null, arguments);
  }
};