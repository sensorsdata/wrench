import test from 'tape';
import sinon from 'sinon';
import loadScript from '../src/loadScript';

test('test loadScript function', (t) => {
  // mock head
  var createHead = function () {
    return {
      nodeType: 1,
      tagName: 'head',
      children: [],
      appendChild: function (ele) {
        this.children.push(ele);
      },
    };
  };
  // mock script
  var createScript = function () {
    return {
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
  };
  // mock link
  var createLink = function () {
    return {
      nodeType: 1,
      tagName: 'link',
      rel: '',
      href: '',
      readyState: undefined,
      onload: function () {},
      onreadystatechange: function () {},
      onerror: function () {},
    };
  };

  // 模拟 document 事件
  global.document = {
    createElement: function () {},
    getElementsByTagName: function () {},
  };

  // test loadScript function when script type is js
  // console.log('test loadScript function when script type is js');
  test('test loadScript function when script type is js', (t) => {
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

    var mockHead = new createHead();
    var mockScript = new createScript();

    // 加载 js 脚本
    sinon
      .stub(global.document, 'getElementsByTagName')
      .withArgs('head')
      .returns([mockHead]);
    sinon
      .stub(global.document, 'createElement')
      .withArgs('script')
      .returns(mockScript);
    sinon.stub(mockScript, 'setAttribute').callsFake(function func(v, k) {
      mockScript[v] = k;
    });

    loadScript(para);
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
        `call loadScript when script type is js, then as expected, mockScript.${item.k} is "${item.v}"`
      );
    });

    // test g.onerror
    mockScript.onerror();
    t.equals(mockScript.onerror, null, 'g.onerror performs as expected');

    // test g.onload & g.onreadystatechange
    // 当 !this.readyState || this.readyState = loaded || complete;
    var stub = sinon.stub(mockScript, 'onload');
    var stub2 = sinon.stub(mockScript, 'onreadystatechange');
    [undefined, 'loaded', 'complete'].forEach((item) => {
      ['onload', 'onreadystatechange'].forEach((curr) => {
        stub.restore();
        stub2.restore();
        sinon.stub(mockScript, 'readyState').value(item);
        mockScript[curr]();
        ['onload', 'onreadystatechange'].forEach((i) => {
          t.equal(
            mockScript[i],
            null,
            `call g.${curr} when mockScript.readyState is ${JSON.stringify(
              item
            )}, then g.${i} turns to null`
          );
        });
      });
    });

    // 当 !(!this.readyState || this.readyState = loaded || complete)
    stub.restore();
    stub2.restore();
    sinon.stub(mockScript, 'readyState').value('test');
    ['onload', 'onreadystatechange'].forEach((value) => {
      mockScript[value]();
      ['onload', 'onreadystatechange'].forEach((v) => {
        t.notEqual(
          mockScript[v],
          null,
          `call g.${value} when mockScript.readyState !== null && this.readyState !== 'loaded' && this.readyState !== 'complete'), then g.${v} won't turn to null`
        );
      });
    });

    sinon.restore();
    t.end();
  });

  test('test loadScript function when script type is css', (t) => {
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

    var mockHead = new createHead();
    var mockLink = new createLink();

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
    // 是否设置正确属性
    const testCases = [
      { k: 'rel', v: 'stylesheet' },
      { k: 'href', v: cssPara.url },
    ];
    testCases.forEach((testCase) => {
      t.equal(
        mockLink[testCase.k],
        testCase.v,
        `call loadScript(para) when para.type is css, then as expected, mockLink.${testCase.k} turns to "${testCase.v}"`
      );
    });

    // test g.onload & g.onreadystatechange
    // 当 !this.readyState || this.readyState = loaded || complete;
    var stub = sinon.stub(mockLink, 'onload');
    var stub2 = sinon.stub(mockLink, 'onreadystatechange');
    [undefined, 'loaded', 'complete'].forEach((item) => {
      ['onload', 'onreadystatechange'].forEach((curr) => {
        stub.restore();
        stub2.restore();
        sinon.stub(mockLink, 'readyState').value(item);
        mockLink[curr]();
        ['onload', 'onreadystatechange'].forEach((i) => {
          t.equal(
            mockLink[i],
            null,
            `call g.${curr} when mockLink.readyState is ${JSON.stringify(
              item
            )}, then g.${i} turns to null`
          );
        });
      });
    });
    stub.restore();
    stub2.restore();

    // 当 !(!this.readyState || this.readyState = loaded || complete)
    stub.restore();
    stub2.restore();
    sinon.stub(mockLink, 'readyState').value('test');
    ['onload', 'onreadystatechange'].forEach((value) => {
      mockLink[value]();
      ['onload', 'onreadystatechange'].forEach((v) => {
        t.notEqual(
          mockLink[v],
          null,
          `call g.${value} when mockLink.readyState !== null && this.readyState !== 'loaded' && this.readyState !== 'complete'), then g.${v} won't turn to null`
        );
      });
    });

    sinon.restore();
    delete global.document;
    t.end();
  });
  t.end();
});
