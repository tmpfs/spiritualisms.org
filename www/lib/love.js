var $ = require('air');

/**
 *  Render the love counters.
 */
function render(doc) {
  console.log(doc);
}

/**
 *  Loads the love counters for all quotes.
 */
function fetch() {
  var ids = [];
  this.quotes.each(function(el) {
    ids.push($(el).data('id'));
  })

  // no elements on page
  if(!ids.length) {
    return; 
  }

  function onResponse(err, res) {
    var doc;
    if(err) {
      return console.error(err); 
    }else if(res) {
      doc = JSON.parse(res); 
    }
    //console.log(doc);
    render(doc);
  }
  var opts = {
    url: this.opts.api + '/quote/love',
    method: 'POST',
    json: true,
    body: ids
  };

  $.request(opts, onResponse.bind(this));
}

/**
 *  Show your love, increments the love counter.
 */
function show(id, e) {
  e.preventDefault();
  var el = $('.quotation[data-id="' + id + '"]');
  console.log('show love: ' + id);
  function onResponse(err, res) {
    var doc;
    if(err) {
      return console.error(err); 
    }else if(res) {
      doc = JSON.parse(res); 
    }
    console.log(doc);
    el.find('span').text(doc[id]);
  }
  var opts = {
    url: this.opts.api + '/quote/' + id + '/love',
    method: 'POST'
  };

  $.request(opts, onResponse.bind(this));
}

/**
 *  Love handlers.
 */
function Love(opts) {
  var scope = this;
  this.opts = opts;
  this.quotes = $('.quotation[data-id]');
  fetch.bind(this)();
  this.quotes.each(function(el) {
    el = $(el);
    var id = el.data('id');
    el.find('a.love').on('click', show.bind(scope, id));
  })
}

module.exports = Love;
