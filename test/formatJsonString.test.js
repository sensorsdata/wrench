import test from 'tape';
import sinon from 'sinon';
import formatJsonString from '../src/formatJsonString';

test('test map encodeDates', (t) => {
  const obj = { a: 1 };
  const target = '{\n  "a": 1\n}';

  var spy = sinon.spy(JSON, 'stringify');

  var val = formatJsonString(obj);
  t.ok(spy.calledOnce, 'when formatJsonString called, then JSON.stringify will be called once.');
  t.equal(
    val,
    target,
    `when call formatJsonString(${JSON.stringify(
      obj
    )}), then it returns '{\n"a": 1\n}'`
  );

  sinon.restore();

  var oldFunc = JSON.stringify;
  sinon.stub(JSON, 'stringify').callsFake(function fakeFn() {
    if (arguments.length > 1) throw 'err';
    else return oldFunc(arguments[0]);
  });

  val = formatJsonString(obj);
  t.equal(
    val,
    '{"a":1}',
    'when call formatJsonString("{ a: 1 }"), then it returns "{"a": 1}"'
  );

  sinon.restore();
  t.end();
});
