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

function retry(options) {

  //if(options.error && options.error.code === 'ECONNREFUSED') {
    //// End reconnecting on a specific error and flush all commands with a individual error
    //return new Error('The server refused the connection');
  //}

  if(options.total_retry_time > 1000 * 60 * 60) {
    // End reconnecting after a specific timeout and flush all commands with a individual error
    return new Error('Retry time exhausted');
  }
  if(options.times_connected > 10) {
    // End reconnecting with built in error
    return undefined;
  }
  // reconnect after
  return Math.min(options.attempt * 100, 3000);
}

/**
 *  Get the redis client connection.
 */
function client(cb) {

  const url = 'redis://cache.spiritualisms.org:6379';

  // connection already established
  if(conn) {
    return cb(null, conn);
  }

  conn = redis.createClient(
    url,
    {password: process.env.SPIRITUALISMS_REDIS_PASS, retry_strategy: retry});

  function done(err) {
    err = err || null; 
    if(err) {
      conn = null;
    }
    cb(err, conn);
  }

  // clean connection reference on disconnect
  conn.on('disconnect', () => {
    //conn.removeAllListeners();
    conn = null;
  })

  conn.on('error', (e) => {
    // NOTE: do not leak password in log output
    if(e.command === 'AUTH' && Array.isArray(e.args)) {
      e.args = ['********']; 
    }
    console.error(e);
  })

  conn.on('reconnecting', (options) => {
    console.log(
      'attempting reconnect %s in %s', options.attempt, options.delay); 
  })

  conn.once('connect', () => {
    console.log('redis connection connected to %s', url); 
  });

  conn.once('ready', () => {
    console.log('redis connection ready to %s', url); 
    done();
  });
}

Counter.prototype.client = client;
Counter.prototype.counter = counter;

module.exports = Counter;
