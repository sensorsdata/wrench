const gdoc = 'npx jsdoc -r -R README.md -d ./doc ./src -c jsdoc.json';
const changeStyle = require('./doc-style').changeStyle;
const run = require('./common').run;

(async function () {
  await run(gdoc);
  changeStyle();
}());