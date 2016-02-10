var util = require('util')
  , Counter = require('./counter');

/**
 *  Reperesents the love counter logic.
 */
function Love() {
  Counter.apply(this, arguments);
  this.prefix = 'love://';
}

util.inherits(Love, Counter);

/**
 *  Get the love counter for a quote.
 *
 *  @param opts {Object} Request options.
 *  @param cb {Function} Callback function.
 */
function getLove(opts, cb) {
  opts.ids = [opts.id];
  this.getLoves(opts, cb);
}

/**
 *  Get the love counter for an array of quote identifiers, the quote documents 
 *  must exist.
 *
 *  Replies with a map of identifiers to numbers.
 *
 *  @param opts {Object} Request options.
 *  @param cb {Function} Callback function.
 */
function getLoves(opts, cb) {
  var client = this.client
    , counter = this.counter
    , prefix = this.prefix
    , ids = opts.ids;

  function onResponse(err, res) {
    if(err) {
      return cb(err); 
    }
    var map = {};
    ids.forEach(function(id, index) {
      counter(id, map, res[index]);
    })
    cb(null, map);
  }

  var args = ids.map(function(id) {
    return prefix + id;
  })
  args = args.concat(onResponse);
  client.mget.apply(client, args);
}

/**
 *  Increment the love counter for a quote, the quote document must exist.
 *
 *  @param opts {Object} Request options.
 *  @param cb {Function} Callback function.
 */
function addLove(opts, cb) {
  opts.keys = [opts.id];
  this.addLoves(opts, cb);
}

/**
 *  Increment the love counter for quotes, the quote documents must exist.
 *
 *  @param opts {Object} Request options.
 *  @param cb {Function} Callback function.
 */
function addLoves(opts, cb) {
  var client = this.client
    , prefix = this.prefix
    , counter = this.counter;

  this.quote.filter(opts, function(err, res, body) {
    if(err) {
      return cb(err); 
    }

    var multi = client.multi();
    body.forEach(function(id) {
      multi.incr(prefix + id);
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

Love.prototype.getLove = getLove;
Love.prototype.getLoves = getLoves;

Love.prototype.addLove = addLove;
Love.prototype.addLoves = addLoves;

module.exports = Love;
