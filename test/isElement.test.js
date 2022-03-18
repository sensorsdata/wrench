import test from 'tape';
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
  var val;
  testCases.forEach((testCase) => {
    val = isElement(testCase.input);
    t.equal(
      val,
      testCase.expect,
      `when call isElement(${JSON.stringify(
        testCase.input
      )}), then it returns ${testCase.expect}`
    );
  });

  var createEle = function name(tagName, ) {
    this.tagName = tagName;
    this.nodeType = 1;
  };
  var arg = new createEle('div');
  val = isElement(arg);
  t.equal(val, true, 'success');

  t.end();
});
