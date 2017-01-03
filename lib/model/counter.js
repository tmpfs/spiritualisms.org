var util = require('util')
  , redis = require('redis')
  //, client = redis.createClient('redis://cache.spiritualisms.org:6379')
  , conn = null
  , Abstract = require('./abstract')
  , Quote = require('./quote');

/**
 *  Abstract class for the love and star counters.
 */
function Counter() {
  Abstract.apply(this, arguments);
  //this.conn = null;
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

  // connection already established
  if(conn) {
    return cb(null, conn);
  }

  conn = redis.createClient(
    'redis://cache.spiritualisms.org:6379',
    {password: process.env.SPIRITUALISMS_REDIS_PASS});

  function done(err) {
    err = err || null; 
    if(err) {
      conn = null;
    }
    cb(err, conn);
  }

  // clean connection reference on disconnect
  conn.on('disconnect', () => {
    conn.removeAllListeners();
    conn = null;
  })

  conn.once('error', done);
  conn.once('ready', done);
}

Counter.prototype.client = client;
Counter.prototype.counter = counter;

module.exports = Counter;
