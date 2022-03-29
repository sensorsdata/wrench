import test from 'tape';
import sinon from 'sinon';
import ry from '../src/ry';

// mock this dom structure
// <div id='sp1' test='123'>"test"</div>
var mockDom = function () {
  return {
    nodeType: 1,
    tagName: 'div',
    innerHTML: 'test',
    className: '',
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
    children: [],
    offsetWidth: 10,
    offsetHeight: 10,
    getAttribute: function (key) {
      return this[key];
    },
    setAttribute: function (key, value) {
      this[key] = value;
    },
    getBoundingClientRect: function () {},
    ownerDocument: {
      // defaultView: {
      //   getComputedStyle: function () {},
      // },
    },
    currentStyle: {},
    parentNode: [],
    parentElement: [],
    appendChild: function () {},
  };
};

test('test ry function', (t) => {
  test('test DomElementInfo.prototype.addClass, DomElementInfo.prototype.hasClass, and DomElementInfo.prototype.removeClass', (t) => {
    const dom = new mockDom();
    const newDom = ry(dom);
    // addClass
    newDom.addClass('div-style-test');
    t.equal(
      newDom.ele.className,
      'div-style-test',
      'DomElementInfo.prototype.addClass performs as expected'
    );
    // hasClass
    t.equal(
      newDom.hasClass('div-style-test'),
      true,
      'DomElementInfo.prototype.hasClass when this.ele has className "div-style-test", then it returns true'
    );
    t.equal(
      newDom.hasClass('button-style'),
      false,
      'call DomElementInfo.prototype.hasClass when this.ele does not have className "button-style", then it returns false'
    );
    // removeClass
    newDom.removeClass('div-style-test');
    t.equal(
      newDom.ele.className,
      '',
      'DomElementInfo.prototype.removeClass performs as expected'
    );
    t.end();
  });

  test('test DomElementInfo.prototype.attr', (t) => {
    const dom = new mockDom();
    const newDom = ry(dom);
    // attr(key)
    let val = newDom.attr('innerHTML');
    t.equal(
      val,
      'test',
      'call DomElementInfo.prototype.attr("innerHTML") when newDom has attr "innerHTML", then it returns "test"'
    );
    // attr(key, value)
    newDom.attr('innerHTML', 'new test');
    t.equal(
      newDom.ele.innerHTML,
      'new test',
      'call DomElementInfo.prototype.attr("innerHTML", "new test"), newDom.ele.innerHTML is updated to "new test"'
    );
    t.end();
  });

  test('test DomElementInfo.prototype.offset', (t) => {
    const dom = new mockDom();
    // if (rect.width || rect.height)
    global.window = {
      pageXOffset: 20,
      pageYOffset: 20,
    };
    sinon.stub(dom, 'getBoundingClientRect').callsFake(function func() {
      return {
        width: 200,
        height: 200,
        top: 100,
        left: 300,
      };
    });
    sinon.stub(dom, 'ownerDocument').value({
      documentElement: {
        clientTop: 10,
        clientLeft: 20,
      },
    });
    const newDom = ry(dom);
    var val = newDom.offset();
    t.deepEqual(
      val,
      { top: 110, left: 300 },
      'DomElementInfo.prototype.offset performs as expeted when (rect.width || rect.height)'
    );

    sinon.restore();
    sinon.stub(dom, 'getBoundingClientRect').callsFake(function func() {
      return {
        width: undefined,
        height: undefined,
      };
    });
    const newDomSec = ry(dom);
    val = newDomSec.offset();
    t.deepEqual(
      val,
      { top: 0, left: 0 },
      'DomElementInfo.prototype.offset performs as expeted when (!rect.width && !rect.height)'
    );

    sinon.restore();
    delete global.window;
    t.end();
  });

  test('test DomElementInfo.prototype.getSize', (t) => {
    global.window = {
      getComputedStyle: function () {},
    };

    const dom = new mockDom();
    const newDom = ry(dom);

    // if (!window.getComputedStyle)
    sinon.stub(global.window, 'getComputedStyle').value(undefined);
    var val = newDom.getSize();
    t.deepEqual(
      val,
      { width: 10, height: 10 },
      'DomElementInfo.prototype.getSize perfoms as expected when !window.getComputedStyle'
    );

    sinon.restore();

    // window.getComputedStyle
    sinon.stub(dom, 'getBoundingClientRect').callsFake(function func() {
      return { width: 200, height: 200 };
    });
    val = newDom.getSize();
    t.deepEqual(
      val,
      { width: 200, height: 200 },
      'DomElementInfo.prototype.getSize perfoms as expected when window.getComputedStyle and exceptions did not happen'
    );

    // 抛出异常
    sinon.restore();
    val = newDom.getSize();
    t.deepEqual(
      val,
      { width: 0, height: 0 },
      'DomElementInfo.prototype.getSize perfoms as expected when window.getComputedStyle and exceptions happened'
    );
    delete global.window;
    t.end();
  });

  test('test DomElementInfo.prototype.getStyle', (t) => {
    const dom = new mockDom();
    const newDom = ry(dom);

    // if this.ele.currentStyle
    sinon.stub(newDom.ele, 'currentStyle').value({ test: '233' });
    var val = newDom.getStyle('test');
    t.equal(
      val,
      '233',
      'DomElementInfo.prototype.getStyle performs as expected'
    );

    sinon.restore();
    t.end();
  });

  test('test DomElementInfo.prototype.wrap', (t) => {
    const mockParent = {
      nodeType: 1,
      tagName: 'head',
      children: [],
      insertBefore: function (newNode, referenceNode) {
        var ind = this.children.indexOf(referenceNode);
        if (ind == 0) {
          this.children.unshift(newNode);
        } else {
          this.children.splice(ind - 1, 1, newNode);
        }
      },
    };

    const mockDiv = {
      nodeType: 1,
      tagName: 'div',
      children: [],
      appendChild: function (ele) {
        this.children.push(ele);
      },
    };

    global.document = { createElement: function () {} };
    sinon
      .stub(global.document, 'createElement')
      .withArgs('div')
      .returns(mockDiv);

    const dom = new mockDom();
    mockParent.children.push(dom);
    sinon.stub(dom, 'parentNode').value(mockParent);

    const newDom = ry(dom);
    var wrapDom = newDom.wrap('div');

    t.deepEqual(
      wrapDom.ele.children[0],
      newDom.ele,
      'DomElementInfo.prototype.wrap performs as expected'
    );
    t.deepEqual(
      mockParent.children[0],
      mockDiv,
      'DomElementInfo.prototype.wrap performs as expected'
    );

    sinon.restore();
    delete global.document;
    t.end();
  });

  test('test DomElementInfo.prototype.getCssStyle', (t) => {
    var dom = new mockDom();
    dom.style = {
      getPropertyValue: function () {},
    };
    sinon.stub(dom.style, 'getPropertyValue').withArgs('color').returns('red');
    // if this.ele.style.getPropertyValue(prop)
    var newDom = ry(dom);
    var val = newDom.getCssStyle('color');
    t.equal(
      val,
      'red',
      'DomElementInfo.prototype.getCssStyle performs as expected'
    );
    sinon.restore();

    // typeof window.getMatchedCSSRules === 'function'
    // !rules || !isArray(rules)
    sinon
      .stub(dom.style, 'getPropertyValue')
      .withArgs('color')
      .returns(undefined);
    global.window = {
      getMatchedCSSRules: function () {},
    };
    newDom = ry(dom);
    [null, 666].forEach((item) => {
      sinon
        .stub(global.window, 'getMatchedCSSRules')
        .withArgs(newDom.ele)
        .returns(item);
      val = newDom.getCssStyle('color');
      t.equal(
        val,
        null,
        'DomElementInfo.prototype.getCssStyle performs as expected'
      );
      sinon.restore();
    });

    // typeof window.getMatchedCSSRules === 'function'
    // isArray(rules)
    var r = { style: { getPropertyValue: function () {} } };
    sinon
      .stub(global.window, 'getMatchedCSSRules')
      .withArgs(newDom.ele)
      .returns([r]);
    sinon.stub(r.style, 'getPropertyValue').withArgs('color').returns('red');
    val = newDom.getCssStyle('color');
    t.equal(
      val,
      'red',
      'DomElementInfo.prototype.getCssStyle performs as expected'
    );

    sinon.restore();
    delete global.window;
    t.end();
  });

  test('test DomElementInfo.prototype.next & DomElementInfo.prototype.prev', (t) => {
    const tmp = {
      nodeType: 1,
      tagName: 'div',
      nextSibling: {
        nodeType: 1,
        tagName: 'p',
        innerHTML: 'nextTest',
      },
      previousSibling: {
        nodeType: 1,
        tagName: 'p',
        innerHTML: 'previousTest',
      },
    };

    const Ele = ry(tmp);
    var val = Ele.next();
    t.deepEqual(
      val,
      { nodeType: 1, tagName: 'p', innerHTML: 'nextTest' },
      'DomElementInfo.prototype.next performs as expected'
    );
    val = Ele.prev();
    t.deepEqual(
      val,
      { nodeType: 1, tagName: 'p', innerHTML: 'previousTest' },
      'DomElementInfo.prototype.prev performs as expected'
    );
    t.end();
  });

  test('test DomElementInfo.prototype.siblings & DomElementInfo.prototype.children', (t) => {
    // test DomElementInfo.prototype.siblings
    var dom = new mockDom();
    const mockSpan = { nodeType: 1, tagName: 'span' };
    const mockP = { nodeType: 1, tagName: 'p', nextSibling: mockSpan };
    const mockParent = {
      nodeType: 1,
      tagName: 'div',
      children: [mockP, mockSpan, dom],
      firstChild: mockP,
    };
    dom.parentNode = mockParent;
    var newDom = ry(dom);
    var val = newDom.siblings();
    t.deepEqual(
      val,
      [mockP, mockSpan],
      'success, DomElementInfo.prototype.siblings performs as expected'
    );

    // test DomElementInfo.prototype.children
    dom = new mockDom();
    dom.firstChild = mockSpan;
    newDom = ry(dom);
    val = newDom.children();
    t.deepEqual(
      val,
      [mockSpan],
      'success, DomElementInfo.prototype.children performs as expected'
    );
    t.end();
  });

  test('test DomElementInfo.prototype.parent', (t) => {
    var dom = new mockDom();
    const mockParent = {
      nodeType: 1,
      tagName: 'div',
      children: [],
    };
    dom.parentNode = mockParent;

    var newDom = ry(dom);
    var val = newDom.parent();
    t.deepEqual(
      val.ele,
      mockParent,
      'DomElementInfo.prototype.parent performs as expected'
    );
    t.end();
  });

  test('test DomElementInfo.prototype.previousElementSibling', (t) => {
    global.document = {
      documentElement: { previousElementSibling: undefined },
    };
    const prev = {
      nodeType: 1,
      tagName: 'div',
      innerHTML: 'prev',
      className: 'prev-div-style',
    };
    var dom = new mockDom();
    dom.previousElementSibling = prev;

    // 'previousElementSibling' in document.documentElement
    sinon
      .stub(global.document.documentElement, 'previousElementSibling')
      .value(prev);
    var newDom = ry(dom);
    var val = newDom.previousElementSibling();
    t.deepEqual(
      val.ele,
      prev,
      'DomElementInfo.prototype.previousElementSibling performs as expected when "previousElementSibling" in document.documentElement'
    );
    sinon.restore();

    // 不支持 previousElementSibling
    // el.previousSibling && el.previousSibling.nodeType === 1
    sinon.stub(global.document, 'documentElement').value({});
    dom.previousElementSibling = null;
    dom.previousSibling = prev;
    newDom = ry(dom);
    val = newDom.previousElementSibling();
    t.deepEqual(
      val.ele,
      prev,
      'DomElementInfo.prototype.previousElementSibling performs as expected'
    );
    // !el.previousSibling
    dom.previousSibling = null;
    newDom = ry(dom);
    val = newDom.previousElementSibling();
    t.deepEqual(
      val.ele,
      null,
      'DomElementInfo.prototype.previousElementSibling performs as expected'
    );
    sinon.restore();
    delete global.document;
    t.end();
  });

  test('test DomElementInfo.prototype.getSameTypeSiblings', (t) => {
    const mockParent = {
      nodeType: 1,
      tagName: 'div',
      children: [],
    };
    var dom = new mockDom();
    dom.parentNode = mockParent;
    mockParent.children = [dom];

    // 找不到和当前元素相同类型的同级元素
    var newDom = ry(dom);
    var val = newDom.getSameTypeSiblings();
    t.deepEqual(
      val,
      [dom],
      'DomElementInfo.prototype.getSameTypeSiblings performs as expected when its parentNode.children has the same type siblings of this.ele'
    );

    // dom = new mockDom();
    mockParent.children = [];
    newDom = ry(dom);
    val = newDom.getSameTypeSiblings();
    t.deepEqual(
      val,
      [],
      'call DomElementInfo.prototype.getSameTypeSiblings when its parentNode.children does not have the same type siblings of this.ele, then it returns []'
    );

    t.end();
  });

  test('test DomElementInfo.prototype.getParents', (t) => {
    const testCases = [
      {
        attr: 'nodeType',
        replaceAttr: 2,
        info: '!ieElement(newDom.ele)',
      },
      {
        attr: 'parentElement',
        replaceAttr: null,
        info: 'newDom.ele.parentElement === null',
      },
    ];

    var val;
    testCases.forEach((testCase) => {
      var dom = new mockDom();
      dom[testCase.attr] = testCase.replaceAttr;
      var newDom = ry(dom);
      val = newDom.getParents();
      t.deepEqual(
        val,
        [],
        `call DomElementInfo.prototype.getParents when ${testCase.info}, then it returns []`
      );
    });

    var dom = new mockDom();
    var newDom = ry(dom);
    sinon
      .stub(newDom.ele, 'parentElement')
      .value({ nodeType: 1, tagName: 'div', parentElement: null });
    val = newDom.getParents();
    sinon.restore();
    t.deepEqual(
      val,
      [newDom.ele, { nodeType: 1, tagName: 'div', parentElement: null }],
      'call DomElementInfo.prototype.getParents when element !== null but newDom.ele.parentElement === null, then it returns []'
    );

    // 抛出异常
    sinon.stub(Array.prototype, 'push').throws('some exceptions');
    newDom = ry(dom);
    val = newDom.getParents();
    sinon.restore();
    t.deepEqual(
      val,
      [],
      'call DomElementInfo.prototype.getParents when some exceptions happens, then it returns []'
    );
    t.end();
  });
  t.end();
});
