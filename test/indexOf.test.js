import test from 'tape';
import indexOf from '../src/indexOf';
import sinon from 'sinon';

test('test indexOf function', (t) => {
  const testCases = [
    { input: [[1, 2, 3], 1], expect: 0 },
    { input: [[1, 2, 3], 0], expect: -1 }
  ];

  var arr = [1, 2, 3];
  var spy = sinon.spy(Array.prototype, 'indexOf');
  let val = indexOf(arr, 1);
  t.ok(
    spy.calledOnce,
    'when indexOf called, then Array.prototype.indexOf will be called once.'
  );
  t.equal(val, 0, `when call indexOf([${arr}], 1), then it returns 0`);

  sinon.restore();

  sinon.stub(Array.prototype, 'indexOf').value(undefined);
  testCases.forEach((testCase) => {
    const val = indexOf(testCase.input[0], testCase.input[1]);
    t.equal(
      val,
      testCase.expect,
      `call indexOf([${testCase.input[0]}], ${testCase.input[1]}) when Array.prototype.indexOf == undefined, then it returns ${testCase.expect}`
    );
  });

  sinon.restore();
  t.end();
});
