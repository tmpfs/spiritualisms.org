var $ = require('air');

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

function onResponse(cb, err, res) {
  if(err) {
    return console.error(err); 
  }
  cb(null, res);
}

[show, load].forEach(function(m) {
  LoveModel.prototype[m.name] = m;
});

module.exports = LoveModel;
