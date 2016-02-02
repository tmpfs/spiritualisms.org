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

app.get('/quote/random', function(req, res, next) {
  var quote = new Quote()
    , opts = {};
  quote.random(opts, function(err, response, body) {
    if(err) {
      return next(err);
    }
    res.set('content-type', 'application/json');
    res.send(JSON.stringify(body));
  })
});

app.get('/quote/:id', function(req, res, next) {
  var quote = new Quote()
    , opts = {id: req.params.id};
  quote.get(opts, function(err, response, body) {
    if(err) {
      return next(err);
    }
    res.set('content-type', 'application/json');
    res.send(JSON.stringify(body));
  })
});


module.exports = app;
