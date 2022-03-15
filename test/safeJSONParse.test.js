import test from 'tape';
import sinon from 'sinon';
import safeJSONParse from '../src/safeJSONParse';

const json = '{"a":124}';
const obj = { a: 124 };

test('test safeJSONParse function', (t) => {
  var spy = sinon.spy(JSON, 'parse');
  let val = safeJSONParse(json);

  t.ok(
    spy.calledOnce,
    'when safeJSONParse called, JSON.parse will be called once.'
  );

  t.deepEqual(
    val,
    obj,
    'when call  safeJSONParse({"a": 124}), then it returns Object { a: 124 }'
  );

  t.end();
});
