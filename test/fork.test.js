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
var coffee = require('coffee');
var spy = require('spy');
var cp = require('child_process');
var childprocess = require('../');

var childpath = path.join(__dirname, 'fixtures', 'child.js');

describe('fork()', function () {

  before(function() {
    spy(cp, 'fork');
  });
  afterEach(function() {
    childprocess.reset();
    cp.fork.reset();
  });
  after(function() {
    cp.fork.restore();
  });

  it('should assert type', function() {
    assert.throws(function() {
      childprocess.inject();
    }, /argument in \.inject\(\) should be function or filepath/);
  });

  it('should call original fork', function(done) {
    coffee.fork(path.join(__dirname, 'fixtures/multi_process/index.js'))
    .debug()
    .expect('code', 0)
    .end(function(err, res) {
      assert.ifError(err);
      assert.equal(res.stdout, '');
      done();
    });
  });

  it('should work when inject function', function(done) {
    childprocess.inject(function(modulePath, args, opt) {
      console.log(modulePath);
      return [modulePath, args, opt];
    });
    coffee.fork(path.join(__dirname, 'fixtures/multi_process/index.js'))
    .debug()
    .expect('stdout', /test_fixtures_multi_process_child\.js/)
    .expect('stdout', /test_fixtures_multi_process_grandchild\.js/)
    .expect('code', 0)
    .end(function(err) {
      assert.ifError(err);
      assert.ok(/test\/fixtures\/multi_process\/index\.js/.test(cp.fork.calls[0].arguments[0]));
      done();
    });
  });

  it('should work when inject function using os.tmpdir', function(done) {
    mm(process.env, 'TMPDIR', '');
    childprocess.inject(function(modulePath, args, opt) {
      console.log(modulePath);
      return [modulePath, args, opt];
    });
    coffee.fork(path.join(__dirname, 'fixtures/multi_process/index.js'))
    .debug()
    .expect('stdout', /test_fixtures_multi_process_child\.js/)
    .expect('stdout', /test_fixtures_multi_process_grandchild\.js/)
    .expect('code', 0)
    .end(function(err) {
      assert.ifError(err);
      assert.ok(/test\/fixtures\/multi_process\/index\.js/.test(cp.fork.calls[0].arguments[0]));
      done();
    });
  });

  it('should fail', function(done) {
    childprocess.inject(path.join(__dirname, 'fixtures/inject.js'));
    coffee.fork(path.join(__dirname, 'fixtures/multi_process/unknown.js'))
    .debug()
    .expect('error', /Cannot find module/)
    .end(done);
  });

  it('should work when inject jsfile', function(done) {
    childprocess.inject(path.join(__dirname, 'fixtures/inject.js'));
    coffee.fork(path.join(__dirname, 'fixtures/multi_process/index.js'))
    .expect('stdout', /test_fixtures_multi_process_child\.js/)
    .expect('stdout', /test_fixtures_multi_process_grandchild\.js/)
    .expect('code', 0)
    .end(function(err) {
      assert.ifError(err);
      assert.ok(/test\/fixtures\/multi_process\/index\.js/.test(cp.fork.calls[0].arguments[0]));
      done();
    });
  });

  it('should inject function that returned is not expected', function(done) {
    childprocess.inject(function(modulePath) {
      console.log(modulePath);
      return [];
    });
    coffee.fork(path.join(__dirname, 'fixtures/multi_process/index.js'))
    .debug()
    .expect('code', 0)
    .end(function(err, res) {
      assert.ifError(err);
      assert.equal(res.stdout, '');
      assert.ok(/test\/fixtures\/multi_process\/index\.js/.test(cp.fork.calls[0].arguments[0]));
      done();
    });
  });

  describe('fork with args', function () {

    before(function (done) {
      this.child = cp.fork(childpath, ['1', 'foo']);
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
      this.child = cp.fork(childpath);
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
      this.child = cp.fork(childpath);
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
      this.child = cp.fork(childpath, null, {
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
      var child = cp.fork(childpath, [], {
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
      var child = cp.spawn('echo', ['hi']);
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
