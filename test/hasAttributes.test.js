import test from 'tape';
import hasAttributes from '../src/hasAttributes';

test('test hasAttributes function', (t) => {
  // mock this dom structure
  // <div id='sp1' test='123' test2='345'>"test"</div>
  const div = {
    nodeType: 1,
    tagName: 'div',
    innerHTML: 'test',
    attributes: {
      0: 'id',
      1: 'test',
      2: 'test2',
      id: {
        value: 'sp1',
        specified: true,
      },
      test: {
        value: '123',
        specified: true,
      },
      test2: {
        value: '345',
        specified: true,
      },
    },
  };

  const testCases = [
    // typeof attrNames === 'string'
    { attrNames: 'test', expect: true },
    { attrNames: 'test3', expect: false },
    // isArray(attrNames)
    { attrNames: ['test', 'test2'], expect: true },
    { attrNames: ['tester', 'test'], expect: true },
    // !(typeof attrNames === 'string') && !isArray(attrNames)
    { attrNames: undefined, expect: undefined },
  ];

  testCases.forEach((testCase) => {
    var val = hasAttributes(div, testCase.attrNames);
    t.equal(
      val,
      testCase.expect,
      `call hasAttribute(<div id='sp1' test='123' test2='345'>"test"</div>, ${testCase.attrNames}), and then it returns ${testCase.expect} as expected`
    );
  });

  t.end();
});
