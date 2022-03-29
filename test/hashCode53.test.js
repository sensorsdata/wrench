import test from 'tape';
import hashCode53 from '../src/hashCode53';

test('test hashCode53 function', (t) => {
  const testCases = [
    { input: '', expect: 0 },
    { input: 'hello world', expect: -5975507814869267 },
    { input: 'JavaScript_шеллы', expect: 4968547713331013 },
  ];

  var val;
  testCases.forEach((testCase) => {
    val = hashCode53(testCase.input);
    t.deepEqual(
      val,
      testCase.expect,
      `when call hashCode53(${JSON.stringify(
        testCase.input
      )}), then it returns ${testCase.expect}`
    );
  });
  t.end();
});
