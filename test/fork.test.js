/**!
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

var pedding = require('pedding');
var mm = require('mm');
var assert = require('assert');
var path = require('path');
var childprocess = require('../');

var childpath = path.join(__dirname, '..', 'fixtures', 'child.js');

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

  describe('fork with options.cwd', function() {
    it('should change cwd to test/fixtures/demo', function(done) {
      var childpath = path.join(__dirname, 'fixtures', 'demo', 'foo.js');
      var cwd = path.join(__dirname, 'fixtures', 'demo');
      var child = childprocess.fork(childpath, [], {
        cwd: cwd,
      });
      child.on('exit', function (code) {
        assert.equal(code, 0);
        done();
      });
    });
  });

  describe('spawn()', function() {
    it('should spawn work', function(done) {
      done = pedding(2, done);
      var child = childprocess.spawn('echo', ['hi']);
      child.stdout.on('data', function(data) {
        assert.equal(data.toString(), 'hi\n');
        done();
      });
      child.on('exit', function (code) {
        assert.equal(code, 0);
        done();
      });
    });
  });

});
