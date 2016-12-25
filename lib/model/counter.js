var util = require('util')
  , redis = require('redis')
  , client = redis.createClient('redis://cache.spiritualisms.org:6379')
  , Abstract = require('./abstract')
  , Quote = require('./quote');

/**
 *  Abstract class for the love and star counters.
 */
function Counter() {
  Abstract.apply(this, arguments);
  this.client = client;
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

Counter.prototype.counter = counter;

module.exports = Counter;
