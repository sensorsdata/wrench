import test from 'tape';
import getElementContent from '../src/getElementContent';

test('test getElementContent function', t => {
  const elementCases = [
    {
      textContent: 'hello world',
      expected: 'hello world'
    },
    {
      textContent: 'hello\n city\r\n',
      expected: 'hello city'
    },
    {
      innerText: ' hello province    1',
      expected: 'hello province 1'
    },
    {
      innerText: (() => { let str = ''; for (let i = 0; i < 300; i++) { str += '1'; } return str; })(),
      expected: (() => { let str = ''; for (let i = 0; i < 255; i++) { str += '1'; } return str; })()
    },
  ];

  elementCases.forEach(e => {
    t.equal(getElementContent(e), e.expected, `when call getElementContent(${JSON.stringify(e)}), then it returns ${e.expected}`);
  });

  const elementCaseInput = {
    textContent: 'hello world',
    tagName: 'INPUT',
    value: 'hello wrench'
  };

  const ret = getElementContent(elementCaseInput, elementCaseInput.tagName);
  t.equal(ret, elementCaseInput.value, `when call getElementContent(${JSON.stringify(elementCaseInput)}), then it returns "hello wrench"`);

  t.end();
});