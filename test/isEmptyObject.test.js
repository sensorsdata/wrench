import test from 'tape';
import isEmptyObject from '../src/isEmptyObject';

test('test isEmptyObject function', (t) => {
  // 对象继承
  function Parent() {
    this.value = '';
  }
  Parent.prototype.getParentValue = function () {
    return this.value;
  };
  function Child() {}
  Child.prototype = new Parent();
  var instance = new Child();

  const testCases = [
    { input: { test: '2', count: 2 }, expect: false },
    { input: {}, expect: true },
    { input: 1, expect: false },
    { input: instance, expect: true },
    { input: [], expect: false },
    { input: null, expect: false },
    { input: undefined, expect: false },
    { input: true, expect: false },
  ];

  testCases.forEach((testCase) => {
    var val = isEmptyObject(testCase.input);
    t.equal(
      val,
      testCase.expect,
      `when call isEmptyObject(${JSON.stringify(
        testCase.input
      )}), then it returns ${testCase.expect}`
    );
  });
  t.end();
});
