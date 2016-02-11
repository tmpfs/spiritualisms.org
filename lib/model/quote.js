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
    limit: opts.limit !== undefined ? opts.limit : 50,
    reduce: typeof(opts.reduce) === 'boolean'
      ? opts.reduce : false,
    include_docs: typeof(opts.include_docs) === 'boolean'
      ? opts.include_docs : true,
    descending: opts.descending !== undefined ? opts.descending : true,
    keys: opts.keys
  }

  if(opts.limit === null) {
    delete opts.qs.limit; 
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
 *  Filter an array of candidate identifiers, removing identifiers 
 *  that do not exist.
 *
 *  @param opts {Object} Request options.
 *  @param cb {Function} Callback function.
 */
function filter(opts, cb) {
  // query the view to determine which documents exist
  var vopts = {
    include_docs: false,
    keys: opts.keys,
    limit: null
  }

  // determine valid doc ids via view list query
  this.list(vopts, function(err, res, body) {
    var valid = [];
    if(err) {
      return cb(err, res);
    }

    // collect ids from returned rows
    body.rows.forEach(function(row) {
      valid.push(row.id); 
    })

    cb(null, res, valid);
  })
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
    , descending = (Math.random() < 0.5)
    , last = opts.last;
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

    // got same as last id, try again
    if(last && doc.id === last) {
      delete opts.descending;
      return scope.random(opts, cb);
    }

    cb(err, res, doc);
  });
}

/**
 *  Find quotes by tags.
 */
function findByTag(opts, cb) {
  opts = opts || {};
  opts.ddoc = this.ddoc;
  opts.name = 'tags';
  opts.qs = {
    limit: opts.limit !== undefined ? opts.limit : 50,
    reduce: typeof(opts.reduce) === 'boolean'
      ? opts.reduce : false,
    include_docs: typeof(opts.include_docs) === 'boolean'
      ? opts.include_docs : true,
    descending: opts.descending !== undefined ? opts.descending : true,
    keys: opts.keys
  }

  if(opts.limit === null) {
    delete opts.qs.limit; 
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

Quote.prototype.list = list;
Quote.prototype.filter = filter;
Quote.prototype.get = get;
Quote.prototype.random = random;
Quote.prototype.findByTag = findByTag;

module.exports = Quote;
