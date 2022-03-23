import test from 'tape';
import sinon from 'sinon';
import setCssStyle from '../src/setCssStyle';

test('test setCssStyle function', (t) => {
  /** mock this dom structure
   * <head>
   *   <script charset="UTF-8" src="sensorsdata.js"></script>
   * </head>
   */
  // const parentNode
  const mockParent = {
    children: [],
  };
  // mock script
  const mockScript = {
    nodeType: 1,
    tagName: 'script',
    attributes: {
      0: 'charset',
      1: 'src',
      charset: {
        specified: true,
        textContent: 'UTF-8',
        value: 'UTF-8',
      },
      src: {
        specified: true,
        textContent: 'sensorsdata.js',
        value: 'sensorsdata.js',
      },
    },
  };
  // mock head
  const mockHead = {
    nodeType: 1,
    tagName: 'head',
    children: [mockScript],
    insertBefore: function (newNode, referenceNode) {
      var ind = this.children.indexOf(referenceNode);
      if (ind == 0) {
        this.children.unshift(newNode);
      } else {
        this.children.splice(ind - 1, 1, newNode);
      }
    },
    appendChild: function (ele) {
      this.children.push(ele);
    },
  };
  // mock style
  const mockStyle = {
    nodeType: 1,
    tagName: 'style',
    children: [],
    type: '',
    styleSheet: {
      cssText: '',
    },
    innerHTML: '',
    appendChild: function () {
      this.innerHTML = 'body { \n    background :red\n  }';
    },
    parentNode: {
      parent: mockParent,
      insertBefore: function (newEle, referenceNode) {
        var ind = mockParent.children.indexOf(referenceNode);
        if (ind == 0) {
          mockParent.children.unshift(newEle);
        } else {
          mockParent.children.splice(ind - 1, 1, newEle);
        }
      },
    },
  };

  //
  global.document = {
    createElement: function () {},
    createTextNode: function () {},
    getElementsByTagName: function () {},
  };
  var css = `body { 
    background :red
  }`;

  // style.appendChild 未抛出异常 && head && head.children.length
  sinon
    .stub(global.document, 'createElement')
    .withArgs('style')
    .returns(mockStyle);
  sinon
    .stub(global.document, 'getElementsByTagName')
    .withArgs('head')
    .returns([mockHead])
    .withArgs('script')
    .returns([mockScript]);

  setCssStyle(css);
  var val = mockHead.children.indexOf(mockStyle) > -1;
  t.ok(val, 'setCssStyle function performs as expected');

  // mockHead.children 复原
  mockHead.children.shift();
  var stub = sinon.stub(mockStyle, 'appendChild').throws('some exceptions');
  setCssStyle(css);
  val = mockStyle.styleSheet.cssText == css;
  var str =
    'setCssStyle performs as expected when exceptions happened to style.appendChild';
  t.ok(val, str);
  val = mockHead.children.indexOf(mockStyle) == 0;
  t.ok(val, str);
  stub.restore();

  // !head.children.length
  // mockHead.children 复原
  mockHead.children.shift();
  var stub2 = sinon.stub(mockHead, 'children').value([]);
  setCssStyle(css);
  val = mockHead.children.indexOf(mockStyle) == 0;
  t.ok(val, 'setCssStyle function performs as expected when !head.children.length');
  stub2.restore();

  // !head
  sinon.restore();
  sinon
    .stub(global.document, 'createElement')
    .withArgs('style')
    .returns(mockStyle);
  sinon
    .stub(global.document, 'getElementsByTagName')
    .withArgs('head')
    .returns([])
    .withArgs('script')
    .returns([mockStyle]);
  setCssStyle(css);
  val = mockParent.children.indexOf(mockStyle) > -1;
  t.ok(val, 'setCssStyle function performs as expected when !head');

  sinon.restore();
  t.end();
});
