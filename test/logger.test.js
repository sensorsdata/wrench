import test from 'tape';
import Sinon from 'sinon';
import logger from '../src/logger';

test('test logger function', (t) => {
  // 设置了 logFn
  global.myLog = function (arg) {
    console.log(arg);
  };
  var spy = Sinon.spy(global, 'myLog');
  logger.setup(global.myLog);
  logger.log('---logFn exists---');
  t.ok(
    spy.calledOnce,
    'when logger.log called, then logFn will be called once if logFn exists'
  );
  Sinon.restore();
  t.end();
});
