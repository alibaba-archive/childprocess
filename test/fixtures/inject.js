'use strict';

module.exports = function(modulePath, args, opt) {
  console.log(modulePath);
  return [modulePath, args, opt];
};
