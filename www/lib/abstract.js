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

module.exports = Abstract;

