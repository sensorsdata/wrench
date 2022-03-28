import test from 'tape';
// import sinon from 'sinon';
// import ry from '../src/ry';

test('test ry function', (t) => {
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
  };
  console.log(div);

  t.end();
});
