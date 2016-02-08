var $ = require('air')
  , LoveModel = require('./model/love');

/**
 *  Love handlers.
 */
function Love(opts) {
  this.opts = opts;
  this.model = new LoveModel(opts);
  this.init();
  this.fetch();
}


/**
 *  Render the love counters.
 */
function render(doc) {
  var ids = Object.keys(doc);
  ids.forEach(function(id) {
    var el = $('.quotation[data-id="' + id + '"]')
      , txt = el.find('a.love span')
      , count = doc[id];

    el.data('love', count);

    if(!txt.length) {
      el.find('a.love').append($.create('span'));
    }
    if(doc[id]) {
      el.find('a.love span').addClass('love').text('' + count);
    }
  })
}

/**
 *  Loads the love counters for all quotes.
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

function init() {
  var scope = this;
  this.quotes = $('.quotation[data-id]');
  this.quotes.each(function(el) {
    el = $(el);
    var id = el.data('id');
    var show = scope.show.bind(scope, id);
    el.find('a.love').on('click', show);
  })
}

[render, fetch, init, show].forEach(function(m) {
  Love.prototype[m.name] = m;
});

module.exports = Love;
