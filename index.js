'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const assert = require('assert');
const cp = require('child_process');
const originFork = cp.fork;
const childprocess = module.filename;
let callback = null, callbackPath = '';
let tmpdir = process.env.TMPDIR || os.tmpdir();

cp.fork = function(modulePath, args, options) {
  // call original when it's not injected
  if (!(callback && callbackPath)) {
    return originFork.call(cp, modulePath, args, options);
  }

  // call original when modulePath isn't found
  try {
    modulePath = require.resolve(modulePath);
  } catch(err) {
    return originFork.call(cp, modulePath, args, options);
  }

  // create a tmp file that inject text and load modulePath
  const tmpFile = path.join(tmpdir, modulePath.replace(/\//g, '_') + Date.now() + '.js');
  const inject = `
    const childprocess = require('${childprocess}');
    childprocess.inject('${callbackPath}');
    require('${modulePath}');
  `;
  fs.writeFileSync(tmpFile, inject);

  // call original when the value that inject callback returned isn't expected
  args = callback(tmpFile, args, options);
  if (!args || args.length !== 3) {
    args = [modulePath, args, options];
  }

  const proc = originFork.apply(cp, args);
  proc.on('exit', function() {
    fs.unlinkSync(tmpFile);
  });
  return proc;
};

// inject a function that is fired when child_process.fork
exports.inject = function(cb) {
  // inject('/path/to/jsfile')
  if (typeof cb === 'string') {
    callbackPath = cb;
    assert.ok(callbackPath, 'filepath should not be empty');
    assert.ok(fs.existsSync(callbackPath), callbackPath + ' should exist');
    callback = require(callbackPath);
    return;
  }

  // inject(function() {})
  if (typeof cb === 'function') {
    callbackPath = path.join(tmpdir, 'callback_' + Date.now() + '.js');
    callback = cb;
    fs.writeFileSync(callbackPath, `module.exports = ${cb.toString()};`);
    return;
  }

  throw new Error('argument in .inject() should be function or filepath');
};

// reset the inject callback
exports.reset = function() {
  callbackPath = '';
};
