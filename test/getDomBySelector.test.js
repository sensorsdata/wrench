import test from 'tape';
import sinon from 'sinon';
import getDomBySelector from '../src/getDomBySelector';
import logger from '../src/logger';

test('test getDomBySelector function', t => {
  logger.setup(() => { });
  /** mock this dom structure
   * <body>
   *  <div id='id1'>
   *    <ul id='id2'>
   *      <li> hello1</li>
   *      <li> hello2</li>
   *      <li> hello3</li>
   *      <li> hello4</li>
   *    </ul>
   * </div>
   * </body>
   */
  global.document = {
    getElementById: function () { },
    getElementsByTagName: function () { }
  };
  const li1 = { nodeType: 1, tagName: 'li', innerHTML: 'hello1' };
  const li2 = { nodeType: 1, tagName: 'li', innerHTML: 'hello1' };
  const li3 = { nodeType: 1, tagName: 'li', innerHTML: 'hello1' };
  const li4 = { nodeType: 1, tagName: 'li', innerHTML: 'hello1' };
  const id2Ul = { nodeType: 1, tagName: 'ul', id: 'id2', children: [li1, li2, li3, li4] };
  const id1Div = { nodeType: 1, tagName: 'div', id: 'id1', children: [id2Ul] };
  const id5Div = { nodeType: 1, tagName: 'div', id: 'id5', children: [] };
  const mockBody = { nodeType: 1, tagName: 'body', children: [id1Div] };

  sinon.stub(document, 'getElementById').withArgs('id1').returns(id1Div)
    .withArgs('id2').returns(id2Ul).withArgs('id3').returns(null)
    .withArgs('id4').throws('id4 error').withArgs('id5').returns(id5Div);
  sinon.stub(document, 'getElementsByTagName').withArgs('body').returns([mockBody]);

  const testCases = [
    {
      selector: 'body>div:nth-of-type(1)',
      expect: id1Div
    },
    {
      selector: 'body>div:nth-of-type(1)>ul:nth-of-type(1)',
      expect: id2Ul
    },
    {
      selector: '#id1>ul:nth-of-type(1)',
      expect: id2Ul
    },
    {
      selector: '#id2>li:nth-of-type(1)',
      expect: li1
    },
    {
      selector: '#id2>li:nth-of-type(2)',
      expect: li2
    },
    {
      selector: '#id2>li:nth-of-type(3)',
      expect: li3
    },
    {
      selector: '#id2>li:nth-of-type(4)',
      expect: li4
    },
    {
      selector: 'body>div:nth-of-type(1)>ul:nth-of-type(1)>li:nth-of-type(4)',
      expect: li4
    },
    {
      selector: 123,
      expect: null,
    },
    {
      selector: ':nth-of-type',
      expect: null
    },
    {
      selector: 'body>div:nth-of-type(a)',
      expect: null
    },
    {
      selector: 'body>span:nth-of-type(1)',
      expect: null
    },
    {
      selector: 'body>div:nth-of-type(2)',
      expect: null
    },
    {
      selector: '#id1',
      expect: id1Div
    },
    {
      selector: '#id2',
      expect: id2Ul
    },
    {
      selector: '#id3',
      expect: null
    },
    {
      selector: '#id4',
      expect: null
    },
    {
      selector: 'body',
      expect: mockBody
    },
    {
      selector: '#id5>p:nth-of-type(1)',
      expect: null
    }
  ];

  testCases.forEach(tCase => {
    t.equal(getDomBySelector(tCase.selector), tCase.expect, `when call getElementsByTagName(${tCase.selector}), then it returns ${JSON.stringify(tCase.expect)}`);
  });
  t.end();
});