var util = require('util')
  , AbstractModel = require('./abstract');

function Quote() {
  AbstractModel.apply(this, arguments);
}

util.inherits(Quote, AbstractModel);

function list(opts, cb) {
  if(typeof opts === 'function') {
    cb = opts; 
    opts = null;
  }
  opts = opts || {};
  opts.ddoc = 'app';
  var server = this.server(opts);
  server.design.view(opts, cb);
}

Quote.prototype.list = list;

module.exports = Quote;
