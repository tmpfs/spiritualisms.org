var express = require('express')
  , app = express()
  , pkg = require('../package.json')
  , info = JSON.stringify({name: pkg.name, version: pkg.version})
  , Quote = require('../lib/model/quote');

app.get('/', function(req, res) {
  res.send(info)
});

app.get('/quote/list', function(req, res, next) {
  var quote = new Quote()
    , opts = {};
  quote.list(opts, function(err, response, body) {
    if(err) {
      return next(err);
    }
    res.set('content-type', 'application/json');
    res.send(JSON.stringify(body));
  })
});

module.exports = app;
