import test from 'tape';
import sinon from 'sinon';
import hasAttribute from '../src/hasAttribute';

test('test hasAttribute function', (t) => {
  // mock this dom structure
  // <div id='sp1' test='123'>"test"</div>
  const div = {
    nodeType: 1,
    tagName: 'div',
    innerHTML: 'test',
    attributes: {
      0: 'id',
      1: 'test',
      id: {
        value: 'sp1',
        specified: true,
      },
      test: {
        value: '123',
        specified: true,
      },
    },
    hasAttribute: function () {},
  };

  const testCases = [
    { attrName: 'test', expect: true },
    { attrName: 'test2', expect: false },
  ];

  sinon.stub(div, 'hasAttribute').value(undefined);
  testCases.forEach((testCase) => {
    var val = hasAttribute(div, testCase.attrName);
    t.equal(
      val,
      testCase.expect,
      `call hasAttribute(<div id='sp1' test='123'>"test"</div>, ${testCase.attrName}), and then it returns ${testCase.expect} as expected`
    );
  });
  sinon.restore();

  // if ele.hasAttribute
  var stub = sinon.stub(div, 'hasAttribute');
  stub.withArgs('test').returns(true);
  stub.withArgs('test2').returns(false);
  testCases.forEach((testCase) => {
    var val = hasAttribute(div, testCase.attrName);
    t.equal(
      val,
      testCase.expect,
      `call hasAttribute(<div id='sp1' test='123'>"test"</div>, ${testCase.attrName}), and then it returns ${testCase.expect} as expected`
    );
  });
  sinon.restore();

  // !ele.hasAttribute && !ele.attributes
  sinon.stub(div, 'attributes').value(undefined);
  sinon.stub(div, 'hasAttribute').value(undefined);
  sinon
    .stub(div, 'hasAttribute')
    .withArgs('test')
    .returns(true)
    .withArgs('test2')
    .returns(false);
  testCases.forEach((testCase) => {
    var val = hasAttribute(div, testCase.attrName);
    t.equal(
      val,
      undefined,
      `call hasAttribute(<div id='sp1' test='123'>"test"</div>, ${testCase.attrName}) when (!ele.hasAttribute && !ele.attributes), and then it returns undefined as expected`
    );
  });

  sinon.restore();
  t.end();
});
