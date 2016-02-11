var $ = require('air')
  , onResponse = require('./response');

/**
 *  Represents the love counter operations.
 */
function LoveModel(opts) {
  this.opts = opts;
}

/**
 *  Increment the love counter for an identifier.
 */
function show(id, cb) {
  var opts = {
    url: this.opts.api + '/quote/' + id + '/love',
    json: true,
    method: 'POST'
  };
  $.request(opts, onResponse.bind(this, cb));
}

/**
 *  Load the love counters for an array of identifiers.
 */
function load(ids, cb) {

  var opts = {
    url: this.opts.api + '/quote/love',
    method: 'POST',
    json: true,
    body: ids
  };

  $.request(opts, onResponse.bind(this, cb));
}

[show, load].forEach(function(m) {
  LoveModel.prototype[m.name] = m;
});

module.exports = LoveModel;
