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
  opts.qs = {
    limit: opts.limit || 50,
    reduce: typeof(opts.reduce) === 'boolean'
      ? opts.reduce : false,
    include_docs: typeof(opts.include_docs) === 'boolean'
      ? opts.include_docs : true,
    descending: opts.descending !== undefined ? opts.descending : true
  }
  var server = this.server(opts);
  server.design.view(opts, function(err, res, body) {
    if(err) {
      return cb(err); 
    }
    if(!opts.qs.reduce && opts.qs.include_docs) {
      body.rows.forEach(function(row) {
        normalize(row.doc); 
      })
    }
    cb(null, res, body);
  });
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
  server.doc.get(opts, function(err, res, body) {
    if(err) {
      return cb(err); 
    }
    if(!opts.raw) {
      normalize(body);
    }
    cb(null, res, body);
  });
}

function normalize(body) {
  body.id = body._id;
  delete body._id;
  delete body._rev;
  delete body.type;
  delete body.random;
  delete body.publish;
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
    if(!opts.raw) {
      normalize(doc);
    }
    cb(err, res, doc);
  });
}

/**
 *  Increment the love counter for a quote, the quote document must exist.
 *
 *  @param opts {Object} Request options.
 *  @param cb {Function} Callback function.
 */
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

/**
 *  Get the love counter for a quote, the quote document must exist.
 *
 *  @param opts {Object} Request options.
 *  @param cb {Function} Callback function.
 */
function getLove(opts, cb) {
  var server = this.server(opts);
  server.doc.head({id: opts.id}, function(err) {
    // NOTE: anything other than 200 should hit the err clause below
    if(err) {
      return cb(err); 
    }
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
