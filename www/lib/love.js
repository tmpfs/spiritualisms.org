var $ = require('air');

/**
 *  Render the love counters.
 */
function render(doc) {
  console.log('render');
  console.log(doc);
  var ids = Object.keys(doc);
  ids.forEach(function(id) {
    var el = $('.quotation[data-id="' + id + '"]');
    console.log('render: ' + doc[id]);
    if(doc[id]) {
      el.find('span').text('' + doc[id]);
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
  function onResponse(err, res) {
    var doc;
    if(err) {
      return console.error(err); 
    }else if(res) {
      doc = JSON.parse(res); 
    }
    render(doc);
  }
  var opts = {
    url: this.opts.api + '/quote/' + id + '/love',
    method: 'POST'
  };

  $.request(opts, onResponse.bind(this));
}

function init() {
  var scope = this;
  this.quotes = $('.quotation[data-id]');
  this.quotes.each(function(el) {
    el = $(el);
    var id = el.data('id');
    el.find('a.love').off('click');
    el.find('a.love').on('click', show.bind(scope, id));
  })
}

/**
 *  Love handlers.
 */
function Love(opts) {
  this.opts = opts;
  this.render = render.bind(this);
  this.fetch = fetch.bind(this);
  this.init = init.bind(this);
  this.init();
  this.fetch();
}

module.exports = Love;
