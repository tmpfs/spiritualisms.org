var util = require('util')
  , AbstractModel = require('./abstract')
  , redis = require('redis')
  , client = redis.createClient();

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
  //console.dir(opts);
  opts.qs = {
    limit: opts.limit || 50,
    reduce: false,
    include_docs: true,
    descending: opts.descending !== undefined ? opts.descending : true
  }
  //console.dir(opts.qs);
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
 *
 *  @see http://blog.chewxy.com/2012/11/16/random-documents-from-couchdb/
 */
function random(opts, cb) {
  var scope = this
    , rand = Math.random()
    , descending = (Math.random() < 0.5);
  opts = opts || {};
  opts.ddoc = this.ddoc;
  opts.name = 'random';
  opts.qs = {
    startkey: rand,
    descending: opts.descending || descending,
    reduce: false,
    include_docs: true
  }
  var server = this.server(opts);
  server.design.view(opts, function(err, res, body) {
    if(err) {
      return cb(err); 
    }

    // recurse for flip side
    // WARN: we should have a `retries` count in here
    // WARN: to prevent a possible infinite loop
    if(body && body.rows && body.rows.length === 0) {
      opts.descending = !descending;
      return scope.random(opts, cb);
    }
    var doc = body.rows && body.rows.length ? body.rows[0].doc : null;
    cb(err, res, doc);
  });
}

function showLove(opts, cb) {
  var server = this.server(opts);
  server.doc.head({id: opts.id}, function(err) {
    if(err) {
      return cb(err); 
    }
    client.incr('love://' + opts.id, function(err, res) {
      if(err) {
        return cb(err); 
      }
      cb(null, {id: opts.id, love: parseInt(res)});
    });
  })
}

function getLove(opts, cb) {
  var server = this.server(opts);
  server.doc.head({id: opts.id}, function(err, res, body) {
    if(err) {
      return cb(err); 
    }
    if(body.status !== 200) {
      //return cb(); 
    }
    //console.dir(body);
    client.get('love://' + opts.id, function(err, res) {
      if(err) {
        return cb(err); 
      }

      // no love yet :(
      if(res === null) {
        res = 0; 
      }
      cb(null, {id: opts.id, love: parseInt(res)});
    });
  })
}

Quote.prototype.list = list;
Quote.prototype.get = get;
Quote.prototype.random = random;
Quote.prototype.showLove = showLove;
Quote.prototype.getLove = getLove;

module.exports = Quote;
