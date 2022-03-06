const gdoc = 'npx jsdoc -r -R README.md -d ./doc ./src -c jsdoc.json';
const changeStyle = require('./doc-style').changeStyle;
const run = require('./common').run;
const path = require('path');
const rollupCfgPath = path.resolve('.', 'rollup.config.js');
const rollupCmd = `npx rollup --config ${rollupCfgPath}`;
const fs = require('fs');
const indexFileDist = path.resolve('.', 'src', 'index.js');

function generateIndexFile() {
  const srcFolder = path.resolve('.', 'src');
  const files = fs.readdirSync(srcFolder);
  const indexFileContent = files.reduce((p, c) => {
    if (c === 'index.js') {
      return p;
    }
    return `${p}\r\nexport {default as  ${c.slice(0, c.length - 3).split('-').map((v, i) => i > 0 ? v[0].toUpperCase() + v.substring(1) : v).join('')}} from './${c}';`;
  }, '');
  fs.writeFileSync(indexFileDist, indexFileContent);
}

function removeFile(filePath) {
  try {
    fs.unlinkSync(filePath);
  } catch (err) {
    console.warn(err);
  }
}

(async function () {
  console.log('clearing ...');
  await run(`rm -rf ${path.resolve('.', 'dist')}`);
  console.log('generating index.js ...');
  generateIndexFile();
  console.log('building ...');
  await run(rollupCmd);
  removeFile(indexFileDist);
  console.log('generating documents ...');
  await run(gdoc);
  changeStyle();
  console.log('complete.');
}());

