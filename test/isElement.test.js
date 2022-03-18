import test from 'tape';
// import sinon from 'sinon';
import isElement from '../src/isElement';

const testCases = [
  { input: {}, expect: false },
  { input: [], expect: false },
  { input: 1, expect: false },
  { input: true, expect: false },
  { input: null, expect: false },
  { input: undefined, expect: false },
];

test('test isElement function', (t) => {
  testCases.forEach((testCase) => {
    var val = isElement(testCase.input);
    t.equal(
      val,
      testCase.expect,
      `when call isElement(${JSON.stringify(
        testCase.input
      )}), then it returns ${testCase.expect}`
    );
  });

  // global.document = document;
  // var ele = document.createElement('body');
  // t.equal(isElement(ele), true, 'success');
  
  t.end();
});
