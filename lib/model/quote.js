var util = require('util')
  , AbstractModel = require('./abstract');

/**
 *  Quote model representation.
 */
function Quote() {
  AbstractModel.apply(this, arguments);
  this.ddoc = 'app';
  this.name = 'quotes';
}

util.inherits(Quote, AbstractModel);

/**
 *  List quotes.
 *
 *  @param opts {Object} Request options.
 *  @param cb {Function} Callback function.
 */
function list(opts, cb) {
  opts = opts || {};
  opts.ddoc = this.ddoc;
  opts.name = this.name;
  opts.qs = {
    limit: opts.limit || 50,
    reduce: false,
    include_docs: true
  }
  var server = this.server(opts);
  server.design.view(opts, cb);
}

/**
 *  Get a single quote.
 *
 *  @param opts {Object} Request options.
 *  @param cb {Function} Callback function.
 */
function get(opts, cb) {
  opts = opts || {};
  var server = this.server(opts);
  server.doc.get(opts, cb);
}

/**
 *  Get a single random quote.
 *
 *  @param opts {Object} Request options.
 *  @param cb {Function} Callback function.
 */
function random(opts, cb) {
  opts = opts || {};
  opts.ddoc = this.ddoc;
  opts.name = this.name;
  opts.qs = {
    limit: opts.limit || 50,
    reduce: false,
    include_docs: true
  }
  var server = this.server(opts);
  server.design.view(opts, cb);
}

Quote.prototype.list = list;
Quote.prototype.get = get;
Quote.prototype.random = random;

module.exports = Quote;
