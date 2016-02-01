var util = require('util')
  , AbstractModel = require('./abstract');

function Quote() {
  AbstractModel.apply(this, arguments);
  this.ddoc = 'app';
  this.name = 'quotes';
}

util.inherits(Quote, AbstractModel);

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

Quote.prototype.list = list;

module.exports = Quote;
