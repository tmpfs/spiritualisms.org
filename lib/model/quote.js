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
 *  Increment the love counter for a quote, the quote document must exist.
 *
 *  @param opts {Object} Request options.
 *  @param cb {Function} Callback function.
 */
function showLove(opts, cb) {
  var server = this.server(opts)
    , id = opts.id;
  server.doc.head({id: id}, function(err) {
    if(err) {
      return cb(err); 
    }
    client.incr('love://' + opts.id, function(err, res) {
      if(err) {
        return cb(err); 
      }
      var map = {};
      counter(id, map, res);
      cb(null, map);
    });
  })
}

/**
 *  Get the love counter for an array of quote identifiers.
 *
 *  Replies with a map of identifiers to numbers.
 *
 *  @param opts {Object} Request options.
 *  @param cb {Function} Callback function.
 */
function getLoveMulti(opts, cb) {
  var ids = opts.ids;
  ids = ids.map(function(id) {
    return 'love://' + id;
  })

  function onResponse(err, res) {
    if(err) {
      return cb(err); 
    }
    var map = {};
    ids.forEach(function(id, index) {
      id = id.replace(/^love:\/\//, '');
      counter(id, map, res[index]);
    })
    cb(null, map);
  }

  var args = ids.concat(onResponse);
  client.mget.apply(client, args);
}

/**
 *  Get the love counter for a quote, the quote document must exist.
 *
 *  @param opts {Object} Request options.
 *  @param cb {Function} Callback function.
 */
function getLove(opts, cb) {
  opts.ids = [opts.id];
  this.getLoveMulti(opts, cb);
}

/**
 *  Get the star counter for a quote, the quote document must exist.
 *
 *  @param opts {Object} Request options.
 *  @param cb {Function} Callback function.
 */
function getStar(opts, cb) {
  var server = this.server(opts)
    , id = opts.id;
  server.doc.head({id: id}, function(err) {
    // NOTE: anything other than 200 should hit the err clause below
    if(err) {
      return cb(err); 
    }
    client.get('star://' + id, function(err, res) {
      if(err) {
        return cb(err); 
      }

      // no stars yet :(
      if(res === null) {
        res = 0; 
      }
      var map = {};
      counter(id, map, res);
      cb(null, map);
    });
  })
}

/**
 *  Increment the star counter for a quote, the quote document must exist.
 *
 *  @param opts {Object} Request options.
 *  @param cb {Function} Callback function.
 */
function addStar(opts, cb) {
  var server = this.server(opts)
    , id = opts.id;
  server.doc.head({id: id}, function(err) {
    if(err) {
      return cb(err); 
    }
    client.incr('star://' + id, function(err, res) {
      if(err) {
        return cb(err); 
      }
      var map = {};
      counter(id, map, res);
      cb(null, map);
    });
  })
}

/**
 *  Decrement the star counter for a quote, the quote document must exist.
 *
 *  @param opts {Object} Request options.
 *  @param cb {Function} Callback function.
 */
function removeStar(opts, cb) {
  opts.keys = [opts.id];
  this.removeStars(opts, cb);
}

/**
 *  Decrement the star counter for multiple quotes, the quote documents
 *  must exist.
 *
 *  @param opts {Object} Request options.
 *  @param cb {Function} Callback function.
 */
function removeStars(opts, cb) {
  this.filter(opts, function(err, res, body) {
    if(err) {
      return cb(err); 
    }

    var multi = client.multi();
    body.forEach(function(id) {
      multi.decr('star://' + id);
    })

    multi.exec(function(err, res) {
      if(err) {
        return cb(err); 
      }
      var map = {};
      body.forEach(function(id, index) {
        counter(id, map, res[index]);
      })
      cb(null, map);
    })
  })
}

/**
 *  Get the star counter for an array of quote identifiers.
 *
 *  Replies with a map of identifiers to numbers.
 *
 *  @param opts {Object} Request options.
 *  @param cb {Function} Callback function.
 */
function getStarMulti(opts, cb) {
  var ids = opts.ids;
  ids = ids.map(function(id) {
    return 'star://' + id;
  })

  function onResponse(err, res) {
    if(err) {
      return cb(err); 
    }
    var map = {};
    ids.forEach(function(id, index) {
      id = id.replace(/^star:\/\//, '');
      counter(id, map, res[index]);
    })
    cb(null, map);
  }

  var args = ids.concat(onResponse);
  client.mget.apply(client, args);
}

/**
 *  Utility to handle counter responses that are injected
 *  into a map.
 */
function counter(id, map, count) {
  map[id] = parseInt(count) || 0;
  map[id] = Math.max(map[id], 0);
}

Quote.prototype.list = list;
Quote.prototype.filter = filter;
Quote.prototype.get = get;
Quote.prototype.random = random;

Quote.prototype.getLove = getLove;
Quote.prototype.showLove = showLove;
Quote.prototype.getLoveMulti = getLoveMulti;

Quote.prototype.getStar = getStar;
Quote.prototype.addStar = addStar;
Quote.prototype.removeStar = removeStar;
Quote.prototype.removeStars = removeStars;
Quote.prototype.getStarMulti = getStarMulti;

module.exports = Quote;
