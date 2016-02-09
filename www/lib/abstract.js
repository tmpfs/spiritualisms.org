var $ = require('air')
  , EventEmitter = require('emanate');

/**
 *  Generic abstract class.
 */
function Abstract(opts) {
  this.opts = opts;
  this.notifier = opts.notifier;
}

$.inherit(Abstract, EventEmitter);

//[init, fetch, render].forEach(function(m) {
  //Abstract.prototype[m.name] = m;
//});

module.exports = Abstract;

