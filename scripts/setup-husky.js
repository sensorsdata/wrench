
const run = require('./common').run;

function installCommitHook() {
  const huskyBin = 'npx husky';
  const eslintBin = 'npx eslint';
  const utBin = 'npm run test';
  const cmd = `
    rm -rf ./.husky
    git config --unset core.hooksPath
    ${huskyBin} install\n
    ${huskyBin} add .husky/pre-commit "echo husky hook 正在运行代码提交 eslint 检查"\n
    ${huskyBin} add .husky/pre-commit "${eslintBin} --fix . --config .eslintrc.js"\n

    ${huskyBin} add .husky/pre-commit "echo 等待单元测试执行完成."\n
    ${huskyBin} add .husky/pre-commit "${utBin}"\n

    ${huskyBin} add .husky/pre-commit "git add ."\n
  `;
  return run(cmd);
}

(async function () {
  console.log('正在安装代码提交检查程序');
  await installCommitHook();
  console.log('代码提交检查程序安装完成');
}());
