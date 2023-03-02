const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

function getHTMLFiles(folder) {
  var htmlFiles = [];
  function traverseFiles(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(function (f) {
      const fullDir = path.join(dir, f);
      if (fs.statSync(fullDir).isDirectory()) {
        traverseFiles(fullDir);
      } else {
        if (f.endsWith('.html')) {
          htmlFiles.push(fullDir);
          return;
        }
      }
    });
    return htmlFiles;
  }
  return traverseFiles(folder);
}

function changeStyle() {
  const htmlPaths = getHTMLFiles(path.resolve(path.resolve(__dirname, '../doc')));
  htmlPaths.forEach(path => {
    let content = fs.readFileSync(path, { encoding: 'utf-8' });
    const $ = cheerio.load(content);
    $('.footer').remove();
    $('.page-title h1').each((c, i) => {
      if ($(i).text() === 'Home') {
        $(i).text('神策 SDK 工具库');
      }
    });

    // const selectors = ['.category h3', '.content h1'];
    // selectors.forEach(s => {
    //     const allGlobalTexts = $(s);
    //     for (let i = 0; i < allGlobalTexts.length; i++) {
    //         $(allGlobalTexts[i]).text('Methods');
    //     }
    // })

    fs.writeFileSync(path, $.html());
  });
}

module.exports = { changeStyle };