var util = require('util')
  , Counter = require('./counter');

/**
 *  Reperesents the star counter logic.
 */
function Love() {
  Counter.apply(this, arguments);
}

util.inherits(Love, Counter);

/**
 *  Get the love counter for a quote, the quote document must exist.
 *
 *  @param opts {Object} Request options.
 *  @param cb {Function} Callback function.
 */
function getLove(opts, cb) {
  opts.ids = [opts.id];
  this.getLoves(opts, cb);
}

/**
 *  Get the love counter for an array of quote identifiers.
 *
 *  Replies with a map of identifiers to numbers.
 *
 *  @param opts {Object} Request options.
 *  @param cb {Function} Callback function.
 */
function getLoves(opts, cb) {
  var client = this.client
    , counter = this.counter;

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
 *  Increment the love counter for a quote, the quote document must exist.
 *
 *  @param opts {Object} Request options.
 *  @param cb {Function} Callback function.
 */
function showLove(opts, cb) {
  var client = this.client
    , counter = this.counter;

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

Love.prototype.getLove = getLove;
Love.prototype.showLove = showLove;
Love.prototype.getLoves = getLoves;

module.exports = Love;
