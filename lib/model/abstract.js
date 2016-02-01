var cdb = require('cdb');

function AbstractModel(opts) {
  this.opts = opts || {
    server: process.env.DB_SERVER || 'http://localhost:5984',
    db: process.env.DB || 'quotes'
  }  
}

function merge(opts) {
  var o = {}
    , k;
  for(k in this.opts) {
    o[k] = this.opts[k];
  }
  for(k in opts) {
    o[k] = opts[k];
  }
  return o;
}

function server(opts) {
  return cdb(this.merge(opts));
}

AbstractModel.prototype.merge = merge;
AbstractModel.prototype.server = server;

module.exports = AbstractModel;
