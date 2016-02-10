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

[
  list
].forEach(function(m) {
  QuoteModel.prototype[m.name] = m;
});

module.exports = QuoteModel;
