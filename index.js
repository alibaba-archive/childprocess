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

const childprocess = require('child_process');

exports.fork = function (modulePath, args, options) {
  let execFile = modulePath;
  let execArgs = args || [];
  if (process.env.running_under_istanbul) {
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
