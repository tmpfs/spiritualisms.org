var $ = require('air')
  , Counter = require('./counter')
  , LoveModel = require('./model/love');

/**
 *  Logic for rendering the love counters.
 */
function LoveCount(opts) {

  // id for event prefixes, data attr and class name
  this.id = 'love';

  // link selector
  this.link = 'a.love';

  // counter display selector
  this.counter = 'a.love span';

  // must configure model before calling super
  this.model = new LoveModel(opts);

  Counter.apply(this, arguments);

}

$.inherit(LoveCount, Counter);

/**
 *  Add the link event handlers on initialization.
 */
function onInit(container, id) {
  var show = this.show.bind(this, id);
  container.find(this.link).on('click', show);
}

/**
 *  Show your love, increments the love counter.
 */
function show(id, e) {
  e.preventDefault();
  function onResponse(err, res) {
    // NOTE: errors currently handled by model
    // NOTE: however follow idiomatic signature
    this.render(res.body);
  }
  this.model.show(id, onResponse.bind(this));
}

[onInit, show].forEach(function(m) {
  LoveCount.prototype[m.name] = m;
});

module.exports = LoveCount;
