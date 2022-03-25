import test from 'tape';
import sinon from 'sinon';
import loadScript from '../src/loadScript';

test('test loadScript function', (t) => {
  // mock head
  const mockHead = {
    nodeType: 1,
    tagName: 'head',
    children: [],
    appendChild: function (ele) {
      this.children.push(ele);
    },
  };
  // mock link
  const mockLink = {
    nodeType: 1,
    tagName: 'link',
    rel: '',
    href: '',
    onload: function () {},
    onreadystatechange: function () {},
    onerror: function () {},
  };
  // mock script
  const mockScript = {
    nodeType: 1,
    tagName: 'script',
    charset: '',
    async: '',
    src: '',
    type: '',
    readyState: undefined,
    setAttribute: function () {},
    onload: function () {},
    onreadystatechange: function () {},
    onerror: function () {},
  };

  // 模拟 document 事件
  global.document = {
    createElement: function () {},
    getElementsByTagName: function () {},
  };

  // js para
  var para = {
    url: '/test.js',
    type: 'js',
    success: function () {
      console.log('js script load succeed');
    },
    onerror: function () {
      console.log('js script load error');
    },
  };

  // 加载 js 脚本
  sinon
    .stub(global.document, 'getElementsByTagName')
    .withArgs('head')
    .returns([mockHead]);
  sinon
    .stub(global.document, 'createElement')
    .withArgs('script')
    .returns(mockScript)
    .withArgs('link')
    .returns(mockLink);
  sinon.stub(mockScript);

  loadScript(para);
  mockScript.charset = 'UTF-8';
  // 是否正确设置属性
  const cases = [
    { k: 'async', v: 'async' },
    { k: 'charset', v: 'UTF-8' },
    { k: 'src', v: para.url },
    { k: 'type', v: 'text/javascript' },
  ];
  cases.forEach((item) => {
    t.equal(
      mockScript[item.k],
      item.v,
      `call loadScript(para) when para.type is js, then as expected mockScript.${item.k} is "${item.v}"`
    );
  });

  // g.onerror
  mockScript.onerror();
  t.equals(mockScript.onerror, null, 'g.onerror performs as expected');

  // g.onload
  // this.readyState = loaded || complete
  var stub = sinon.stub(mockScript, 'onload');
  ['loaded', 'complete'].forEach((item) => {
    stub.restore();
    // this.readyState == 'loaded'
    sinon.stub(mockScript, 'readyState').value(item);
    mockScript.onload();
    t.equal(
      mockScript.onload,
      null,
      `call g.onload when mockScript.readyState is "${item}", then g.onload is null`
    );
    t.equal(
      mockScript.onreadystatechange,
      null,
      `call g.onload when mockScript.readyState is "${item}", then g.onreadystatechange is null`
    );
  });

  //  !this.readyState
  stub.restore();
  mockScript.readyState = undefined;
  mockScript.onload();
  t.equal(
    mockScript.onload,
    null,
    'g.onload perfoms as expected when mockScript.readyState == undefined'
  );
  t.equal(
    mockScript.onreadystatechange,
    null,
    'g.onload perfoms as expected when mockScript.readyState == undefined'
  );

  // !!this.readyState && this.readyState !== 'loaded' && this.readyState !== 'complete'
  stub.restore();
  mockScript.readyState = 'test';
  mockScript.onload();
  t.notEqual(
    mockScript.onload,
    null,
    'g.onload perfoms as expected when mockScript.readyState == "test"'
  );

  sinon.restore();

  // 加载 css 脚本
  const cssPara = {
    url: '/test.css',
    type: 'css',
    success: function () {
      console.log('css script load succeed');
    },
    onerror: function () {
      console.log('css script load error');
    },
  };

  sinon.stub(mockLink);
  sinon
    .stub(global.document, 'getElementsByTagName')
    .withArgs('head')
    .returns([mockHead]);
  sinon
    .stub(global.document, 'createElement')
    .withArgs('link')
    .returns(mockLink);
  loadScript(cssPara);
  const testCases = [
    { k: 'rel', v: 'stylesheet' },
    { k: 'href', v: cssPara.url },
  ];
  testCases.forEach((testCase) => {
    t.equal(
      mockLink[testCase.k],
      testCase.v,
      `call loadScript(para) when para.type is css, then as expected, mockLink.${testCase.k} is "${testCase.v}"`
    );
  });

  sinon.restore();
  t.end();
});
