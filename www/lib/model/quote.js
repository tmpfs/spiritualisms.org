var $ = require('air')
  , onResponse = require('./response');

/**
 *  Represents the model for quote documents.
 */
function QuoteModel(opts) {
  opts = opts || {};
  this.opts = opts;
}

/**
 *  Get list of documents by array of identifiers.
 */
function list(ids, cb) {
  var opts = {
    url: this.opts.api + '/quote',
    method: 'POST',
    json: true,
    body: ids
  };
  $.request(opts, onResponse.bind(this, cb));
}

/**
 *  Filter array of document identifiers.
 */
function filter(ids, cb) {
  var opts = {
    url: this.opts.api + '/quote/filter',
    method: 'POST',
    json: true,
    body: ids
  };
  $.request(opts, onResponse.bind(this, cb));
}

[
  list, filter
].forEach(function(m) {
  QuoteModel.prototype[m.name] = m;
});

module.exports = QuoteModel;
