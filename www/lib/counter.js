var $ = require('air')
  , Abstract = require('./abstract');

/**
 *  Abstract class for the love and star counters.
 */
function Counter() {
  Abstract.apply(this, arguments);
  this.notifier.on(this.id + '/update', this.update.bind(this));
}

$.inherit(Counter, Abstract);

function update() {
  this.init();
  this.fetch();
}

/**
 *  Initialize the love event handlers.
 */
function init() {
  this.quotes = $('.quotation[data-id]');
  function it(el) {
    el = $(el);
    this.onInit(el, el.data('id'));
  }
  this.quotes.each(it.bind(this));
}

/**
 *  Loads the counters for all quotes.
 */
function fetch(ids) {
  if(!ids) {
    ids = [];
    this.quotes.each(function(el) {
      ids.push($(el).data('id'));
    })
  }

  // no elements on page
  if(!ids.length) {
    return; 
  }

  function onResponse(err, res) {
    // NOTE: errors currently handled by model
    // NOTE: however follow idiomatic signature
    this.render(res.body);
  }

  this.model.load(ids, onResponse.bind(this));
}

/**
 *  Render the love counters.
 */
function render(doc) {
  var ids = Object.keys(doc);
  function it(id) {
    var el = $('.quotation[data-id="' + id + '"]')
      , txt = el.find(this.counter)
      , count = doc[id];

    el.data(this.id, count);

    if(!txt.length) {
      el.find(this.link).append($.create('span'));
    }
    if(doc[id]) {
      el.find(this.counter).addClass(this.id).text('' + count);
    }

    el.attr({href: '/explore/' + id})
  }
  ids.forEach(it.bind(this));
}

[update, init, fetch, render].forEach(function(m) {
  Counter.prototype[m.name] = m;
});

module.exports = Counter;
