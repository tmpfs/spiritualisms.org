"use strict"

function Application(opts) {
  opts = opts || {};
  this.opts = opts;
  console.log(opts.api);
}

module.exports = Application;
