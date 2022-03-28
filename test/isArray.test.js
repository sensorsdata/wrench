import test from 'tape';
import sinon from 'sinon';
import isArray from '../src/isArray';

test('test isArray function', (t) => {
  const testCases = [
    { input: [1, 2, 3], expect: true },
    { input: {}, expect: false },
    { input: undefined, expect: false },
    { input: null, expect: false },
    { input: 666, expect: false },
    { input: '666', expect: false },
  ];
  
  testCases.forEach((testCase) => {
    const val = isArray(testCase.input);
    t.equal(
      val,
      testCase.expect,
      `when call isArray(${JSON.stringify(testCase.input)}), then it returns ${
        testCase.expect
      }`
    );
  });

  // !Array.isArray
  var stub = sinon.stub(Array, 'isArray');
  stub.value(undefined);
  t.equal(isArray([1, 2, 3]), true, 'success');

  sinon.restore();
  t.end();
});