/**!
 * demo for child process
 *
 * Copyright(c) fengmk2 and other contributors.
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <m@fengmk2.com> (http://fengmk2.com)
 */

'use strict';

/**
 * Module dependencies.
 */

if (process.argv[2] === '1') {
  process.send({
    message: 'start with args work',
    args: process.argv.slice(2),
    running_under_istanbul: !!process.env.running_under_istanbul,
  });
} else {
  process.send({
    message: 'start with empty work',
    running_under_istanbul: !!process.env.running_under_istanbul,
  });
}

process.on('message', function (msg) {
  console.log('[child] got message %j', msg);
  if (msg.type === 'exit') {
    return process.exit(msg.code || 0);
  }
  process.send({
    type: 'reply',
    msg: msg
  });
});
