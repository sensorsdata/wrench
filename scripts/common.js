const exec = require('child_process').exec;
function run(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (e, stdout, stderr) => {
      if (e) {
        reject(stderr);
      }
      resolve(stdout);
    });
  });
}

module.exports = { run };