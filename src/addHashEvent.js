import addEvent from './addEvent';

/** 监听页面哈希变化或页面历史变化
 * @category Event
 * @param {*} callback 页面哈希变化或页面历史变化时触发的回调函数
 * @function addHashEvent
 * @example
 * addHashEvent(function(){
 *   console.log('page changed');
 * })
 */
export default function addHashEvent(callback) {
  var hashEvent = 'pushState' in window.history ? 'popstate' : 'hashchange';
  addEvent(window, hashEvent, callback);
}