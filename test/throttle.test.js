import test from 'tape';
import throttle from '../src/throttle';

test('test throttle function', (t) => {
  var tmp = 1;
  var myFunc = function () {
    tmp += 1;
    // console.log(tmp);
  };
  // 每间隔 1 秒打印一次 hello
  var throttleMyFunc = throttle(myFunc, 1000);
  // 0.1 秒触发一次
  var interval = setInterval(throttleMyFunc, 100);
  // 清除 interval
  var timer = setTimeout(function () {
    t.equal(tmp, 2, 'throttle function performs as expected');
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
    clearTimeout(timer);
    timer = null;
    t.end();
  }, 1000);
});
