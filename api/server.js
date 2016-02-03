var express = require('express')
  , app = express()
  , pkg = require('../package.json')
  , info = JSON.stringify({name: pkg.name, version: pkg.version})
  , Quote = require('../lib/model/quote');

/**
 *  Adds CORS headers to http responses.
 *
 *  @param req The incoming http request.
 *  @param res The outgoing http response.
 */
function cors(req, res) {
  var requested = req.headers['access-control-request-headers'] || []
    , methods = ['GET'];
  if(typeof(requested) === 'string') {
    requested = requested.split(/, ?/);
  }
  var expose = ['Date', 'Content-type', 'Content-Length', 'ETag'];
  res.set('Access-Control-Allow-Origin', "*");
  res.set('Access-Control-Allow-Headers', requested.join(', '));
  res.set('Access-Control-Expose-Headers', expose.join(', '))
  res.set('Access-Control-Allow-Methods', methods.join(', '));
  res.set('Access-Control-Max-Age', 300);
}

app.all('*', function(req, res, next) {
  cors(req, res);
  next();
});

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

// LOVE

app.get('/quote/:id/love', function(req, res, next) {
  var quote = new Quote()
    , opts = {id: req.params.id};
  quote.getLove(opts, function(err, response) {
    if(err) {
      return next(err);
    }
    var body = response;
    res.set('content-type', 'application/json');
    res.send(JSON.stringify(body));
  })
});

app.post('/quote/:id/love', function(req, res, next) {
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
