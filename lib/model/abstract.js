var cdb = require('cdb');

/**
 *  Abstract model representation.
 */
function AbstractModel(opts) {
  this.ddoc = 'app';
  this.opts = opts || {
    server: process.env.DB_SERVER || 'http://db.spiritualisms.org:5984',
    db: process.env.DB || 'quotes',
    basic: true,
    username: process.env.SPIRITUALISMS_COUCHDB_USER,
    password: process.env.SPIRITUALISMS_COUCHDB_PASS
  }  
}

/**
 *  Merge options with the default options.
 *
 *  @param opts {Object} Options to merge.
 */
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

/**
 *  Get a database server reference.
 */
function server(opts) {
  return cdb(this.merge(opts));
}

AbstractModel.prototype.merge = merge;
AbstractModel.prototype.server = server;

module.exports = AbstractModel;
