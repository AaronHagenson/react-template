/*eslint-disable no-undef*/

const fs = require('fs');
const exec = require('child_process').exec;

const isWindows = () => {
  return /^win/.test(process.platform);
};

const nightWatchWinCmd = 'nightwatch.cmd --config nightwatch.js';
const nightWatchCmd = 'nightwatch --config nightwatch.js';

if (isWindows()) {
  child = exec(nightWatchWinCmd, function(error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
      process.exit(1);
    }
    process.exit(0);
  });
} else {
  child = exec(nightWatchCmd, function(error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
      process.exit(1);
    }
    process.exit(0);
  });
}
