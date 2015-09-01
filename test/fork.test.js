/**!
 * childprocess - test/fork.test.js
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

const mm = require('mm');
const assert = require('assert');
const path = require('path');
const childprocess = require('../');

const childpath = path.join(__dirname, '..', 'fixtures', 'child.js');

describe('fork()', function () {

  describe('fork with args', function () {

    before(function (done) {
      this.child = childprocess.fork(childpath, ['1', 'foo']);
      this.child.once('message', function (msg) {
        assert.deepEqual(msg, {
          message: 'start with args work',
          args: ['1', 'foo'],
          running_under_istanbul: true,
        });
        done();
      });
    });

    after(function (done) {
      this.child.send({
        type: 'exit'
      });
      this.child.on('exit', function (code) {
        assert.equal(code, 0);
        done();
      });
    });

    it('should get reply from child process', function (done) {
      this.child.send({
        foo: 'bar',
        hi: 1,
      });
      this.child.once('message', function (msg) {
        assert.deepEqual(msg, {
          type: 'reply',
          msg: {
            foo: 'bar',
            hi: 1,
          }
        });
        done();
      });
    });

  });

  describe('fork without args', function () {

    before(function (done) {
      this.child = childprocess.fork(childpath);
      this.child.once('message', function (msg) {
        assert.deepEqual(msg, {
          message: 'start with empty work',
          running_under_istanbul: true,
        });
        done();
      });
    });

    after(function (done) {
      this.child.send({
        type: 'exit'
      });
      this.child.on('exit', function (code) {
        assert.equal(code, 0);
        done();
      });
    });

    it('should get reply from child process', function (done) {
      this.child.send({
        foo: 'bar',
        hi: 1,
      });
      this.child.once('message', function (msg) {
        assert.deepEqual(msg, {
          type: 'reply',
          msg: {
            foo: 'bar',
            hi: 1,
          }
        });
        done();
      });
    });

  });

  describe('mock running_under_istanbul not exists', function () {

    afterEach(mm.restore);

    before(function (done) {
      mm(process.env, 'running_under_istanbul', '');
      this.child = childprocess.fork(childpath);
      this.child.once('message', function (msg) {
        assert.deepEqual(msg, {
          message: 'start with empty work',
          running_under_istanbul: false,
        });
        done();
      });
    });

    after(function (done) {
      this.child.send({
        type: 'exit'
      });
      this.child.on('exit', function (code) {
        assert.equal(code, 0);
        done();
      });
    });

    it('should get reply from child process', function (done) {
      this.child.send({
        foo: 'bar',
        hi: 1,
      });
      this.child.once('message', function (msg) {
        assert.deepEqual(msg, {
          type: 'reply',
          msg: {
            foo: 'bar',
            hi: 1,
          }
        });
        done();
      });
    });

  });

  describe('fork with autoCoverage = false', function () {

    before(function (done) {
      this.child = childprocess.fork(childpath, null, {
        autoCoverage: false,
      });
      this.child.once('message', function (msg) {
        assert.deepEqual(msg, {
          message: 'start with empty work',
          running_under_istanbul: true,
        });
        done();
      });
    });

    after(function (done) {
      this.child.send({
        type: 'exit'
      });
      this.child.on('exit', function (code) {
        assert.equal(code, 0);
        done();
      });
    });

    it('should get reply from child process', function (done) {
      this.child.send({
        foo: 'bar',
        hi: 1,
      });
      this.child.once('message', function (msg) {
        assert.deepEqual(msg, {
          type: 'reply',
          msg: {
            foo: 'bar',
            hi: 1,
          }
        });
        done();
      });
    });

  });

});
