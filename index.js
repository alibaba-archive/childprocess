/**!
 * childprocess - index.js
 *
 * Copyright(c) node-modules and other contributors.
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <m@fengmk2.com> (http://fengmk2.com)
 */

'use strict';

/**
 * Module dependencies.
 */

var childprocess = require('child_process');

exports.fork = function (modulePath, args, options) {
  var execFile = modulePath;
  var execArgs = args || [];
  options = options || {};
  if (typeof options.autoCoverage !== 'boolean') {
    // default to enable auto cover
    options.autoCoverage = true;
  }
  if (options.autoCoverage && process.env.running_under_istanbul) {
    execFile = './node_modules/.bin/istanbul';
    execArgs = [
      'cover',
      '--report', 'none',
      '--print', 'none',
      '--include-pid',
      modulePath, '--'
    ].concat(execArgs);
  }

  return childprocess.fork(execFile, execArgs, options);
};

exports.spawn = function(command, args, options) {
  return childprocess.spawn(command, args, options);
};
