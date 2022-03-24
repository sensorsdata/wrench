import test from 'tape';
import sinon from 'sinon';
import _localStorage from '../src/localStorage';

// 模拟 window.localStorage
global.window = {
  localStorage: {
    getItem: function () {},
    setItem: function () {},
    removeItem: function () {},
  },
};

// test _localStorage.get
var val;
test('test _localStorage.get', (t) => {
  var k = 'key1';
  var v = 'value1';
  var k2 = 'key2';
  var v2 = JSON.stringify({ a: 1 });
  sinon.stub(global.window.localStorage, 'getItem').withArgs(k).returns(v).withArgs(k2).returns(v2);

  val = _localStorage.get(k);
  t.equal(val, v, '_localStorage.get performs as expected');

  // test _localStorage.parse：未抛出异常
  val = _localStorage.parse(k2);
  t.deepEqual(val, { a: 1 }, '_localStorage.parse performs as expected');

  // !JSON.parse(_localStorage.get(key))
  sinon.stub(JSON, 'parse').withArgs(v2).returns(undefined);
  val = _localStorage.parse(k2);
  t.deepEqual(val, null, '_localStorage.parse performs as expected when JSON.parse(_localStorage.get("key2")) does not exist');

  sinon.restore();

  // test _localStorage.parse：抛出异常
  sinon.stub(JSON, 'parse').throws();
  val = _localStorage.parse(k2);
  t.equal(val, undefined, '_localStorage.parse performs as expected when some exceptions happened');

  sinon.restore();
  t.end();
});

// _localStorage.set
test('test _localStorage.set', (t) => {
  sinon.stub(global.window.localStorage, 'setItem').callsFake(sinon.fake());
  sinon.stub(global.window.localStorage, 'getItem').withArgs('key1').returns('value1');
  _localStorage.set('key1', 'value1');
  val = _localStorage.get('key1');
  t.equal(val, 'value1', '_localStorage.set performs as expected');
  sinon.restore();
  t.end();
});

test('test _localStorage.isSupport', (t) => {
  var k3 = '__local_store_support__';
  var v3 = 'testIsSupportStorage';

  // 未抛出异常
  // _localStorage.get(supportName) == val
  sinon.stub(global.window.localStorage, 'setItem').callsFake(sinon.fake());
  sinon.stub(global.window.localStorage, 'removeItem').callsFake(sinon.fake());
  var stub = sinon.stub(global.window.localStorage, 'getItem');
  stub.withArgs(k3).returns(v3);
  val = _localStorage.isSupport();
  t.equal(val, true, '_localStorage.isSupport performs as expected when _localStorage.get(supportName) == val');

  stub.restore();

  // _localStorage.get(supportName) !== val
  stub.withArgs('__local_store_support__').returns(undefined);
  val = _localStorage.isSupport();
  t.equal(val, false, '_localStorage.isSupport performs as expected when _localStorage.get(supportName) !== val');

  sinon.restore();

  // 抛出异常
  sinon.stub(global.window.localStorage, 'setItem').throws('some exception');
  val = _localStorage.isSupport();
  t.equal(val, false, '_localStorage.isSupport performs as expected when exception happens');

  sinon.restore();
  t.end();
});