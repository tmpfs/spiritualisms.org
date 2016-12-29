var util = require('util')
  , redis = require('redis')
  //, client = redis.createClient('redis://cache.spiritualisms.org:6379')
  , Abstract = require('./abstract')
  , Quote = require('./quote');

/**
 *  Abstract class for the love and star counters.
 */
function Counter() {
  Abstract.apply(this, arguments);
  this.conn = null;
  //this.client = client;
  this.quote = new Quote();
}

util.inherits(Counter, Abstract);

/**
 *  Utility to handle counter responses that are injected
 *  into a map.
 */
function counter(id, map, count) {
  map[id] = parseInt(count) || 0;
  map[id] = Math.max(map[id], 0);
}

/**
 *  Get the redis client connection.
 */
function client(cb) {
  var scope = this
    , conn;

  // connection already established
  if(this.conn) {
    return cb(null, this.conn); 
  }

  conn = redis.createClient(
    'redis://cache.spiritualisms.org:6379',
    {password: process.env.SPIRITUALISMS_REDIS_PASS});

  function done(err) {
    err = err || null; 
    if(!err) {
      scope.conn = conn; 
    }
    cb(err, conn);
  }

  // clean connection reference on disconnect
  conn.on('disconnect', () => {
    this.conn = null;
  })

  conn.once('error', done);
  conn.once('ready', done);
}

Counter.prototype.client = client;
Counter.prototype.counter = counter;

module.exports = Counter;
