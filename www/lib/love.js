var $ = require('air');

function fetch() {
  var ids = [];
  this.quotes.each(function(el) {
    ids.push($(el).data('id'));
  })

  console.log(ids);

  function onResponse(err, res) {
    var doc;
    if(err) {
      return console.error(err); 
    }else if(res) {
      doc = JSON.parse(res); 
    }

    console.log(doc);
  }
  var opts = {
    url: this.opts.api + '/quote/love',
    data: ids
  };

  $.request(opts, onResponse.bind(this));
}


/**
 *  Love handlers.
 */
function Love(opts) {
  this.opts = opts;
  this.quotes = $('.quotation[data-id]');
  var load = fetch.bind(this);
  load();
}

module.exports = Love;
