childprocess
=======

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][cov-image]][cov-url]
[![David deps][david-image]][david-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/childprocess.svg?style=flat-square
[npm-url]: https://npmjs.org/package/childprocess
[travis-image]: https://img.shields.io/travis/node-modules/childprocess.svg?style=flat-square
[travis-url]: https://travis-ci.org/node-modules/childprocess
[cov-image]: https://codecov.io/github/node-modules/childprocess/coverage.svg?branch=master
[cov-url]: https://codecov.io/github/node-modules/childprocess?branch=master
[david-image]: https://img.shields.io/david/node-modules/childprocess.svg?style=flat-square
[david-url]: https://david-dm.org/node-modules/childprocess
[download-image]: https://img.shields.io/npm/dm/childprocess.svg?style=flat-square
[download-url]: https://npmjs.org/package/childprocess

Wrap `child_process` module to support [Multiple Process Code Coverage](https://github.com/gotwarlost/istanbul#multiple-process-usage) with [istanbul].

- [cluster code coverage with istanbul](http://fengmk2.com/blog/2015/cluster-coverage/README.html)

## Install

```bash
$ npm i childprocess
```

## Usage

```js
const childprocess = require('childprocess');
childprocess.inject(function(modulePath, args, opt) {
  const execFile = 'path/to/istanbul';
  const cwd = opt.cwd && process.cwd();
  const execArgs = [
    'cover',
    '--root', cwd,
    '--dir', path.join(cwd, './coverage'),
    '--report', 'none',
    '--print', 'none',
    '--include-pid',
    modulePath,
    '--',
  ].concat(args);
  return [execFile, execArgs, opt];
});
```

## APIs

All APIs are same as [child_process](https://iojs.org/api/child_process.html) module.

- [x] [fork(modulePath[, args][, options])](https://iojs.org/api/child_process.html#child_process_child_process_fork_modulepath_args_options)
- [ ] spawn()
- [ ] exec()
- [ ] execFile()
- [ ] spawnSync()
- [ ] execFileSync()
- [ ] execSync()

## License

[MIT](LICENSE)


[istanbul]: https://github.com/gotwarlost/istanbul
