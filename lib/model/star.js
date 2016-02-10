var util = require('util')
  , Counter = require('./counter');

/**
 *  Reperesents the star counter logic.
 */
function Star() {
  Counter.apply(this, arguments);
  this.prefix = 'star://';
}

util.inherits(Star, Counter);

/**
 *  Get the star counter for a quote, the quote document must exist.
 *
 *  @param opts {Object} Request options.
 *  @param cb {Function} Callback function.
 */
function getStar(opts, cb) {
  opts.ids = [opts.id];
  this.getStars(opts, cb);
}

/**
 *  Get the star counter for an array of quote identifiers.
 *
 *  Replies with a map of identifiers to numbers.
 *
 *  @param opts {Object} Request options.
 *  @param cb {Function} Callback function.
 */
function getStars(opts, cb) {
  var client = this.client
    , counter = this.counter;

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
 *  Increment the star counter for a quote, the quote document must exist.
 *
 *  @param opts {Object} Request options.
 *  @param cb {Function} Callback function.
 */
function addStar(opts, cb) {
  opts.keys = [opts.id];
  this.addStars(opts, cb);
}

/**
 *  Increments the star counter for multiple quotes, the quote documents
 *  must exist.
 *
 *  @param opts {Object} Request options.
 *  @param cb {Function} Callback function.
 */
function addStars(opts, cb) {
  var client = this.client
    , counter = this.counter;

  this.quote.filter(opts, function(err, res, body) {
    if(err) {
      return cb(err); 
    }

    var multi = client.multi();
    body.forEach(function(id) {
      multi.incr('star://' + id);
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
  var client = this.client
    , counter = this.counter;
  this.quote.filter(opts, function(err, res, body) {
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

Star.prototype.getStar = getStar;
Star.prototype.getStars = getStars;
Star.prototype.addStar = addStar;
Star.prototype.addStars = addStars;
Star.prototype.removeStar = removeStar;
Star.prototype.removeStars = removeStars;

module.exports = Star;
