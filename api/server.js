var express = require('express')
  , app = express()
  , env = require('nenv')()
  , pkg = require('../package.json')
  , bodyParser = require('body-parser')
  , info = JSON.stringify({name: pkg.name, version: pkg.version})
  , cors = require('./cors')
  , love = require('./love')
  , star = require('./star')
  , Quote = require('../lib/model/quote')

/**
 *  @api
 *  @swagger 2.0
 *
 *  @title Spiritualisms API
 *  @description Inspirational quote application.
 *  @version 1.0
 *  @license MIT
 *
 *  @host spiritualisms.org
 *  @schemes http https
 *  @basePath /
 *
 *  @consumes application/json
 *  @produces application/json
 */

app.use(bodyParser.json());

app.all('*', function(req, res, next) {
  cors(req, res);
  res.set('content-type', 'application/json');
  next();
});

app.options('*', function(req, res) {
  cors(req, res);
  res.send('');
});

/**
 *  Get service name and version.
 *
 *  @rest
 *  @method GET
 *  @paths /
 */
app.get('/', function(req, res) {
  res.send(info)
});

// routes
love(app);
star(app);

/**
 *  Get a list of quotes.
 *
 *  @rest
 *  @method GET
 *  @paths /quote
 */
app.get('/quote', function(req, res, next) {
  var quote = new Quote()
    , opts = {};
  quote.list(opts, function(err, response, body) {
    if(err) {
      return next(err);
    }
    res.send(body);
  })
});

/**
 *  Get a list of specific quotes.
 *
 *  @rest
 *  @method POST
 *  @paths /quote
 */
app.post('/quote', function(req, res, next) {
  var quote = new Quote()
    , opts = {};

  if(!Array.isArray(req.body)) {
     var err = new Error('Array body expected');
     err.status = 400;
     return next(err);
  }

  opts.keys = req.body;

  quote.list(opts, function(err, response, body) {
    if(err) {
      return next(err);
    }
    res.send(body);
  })
});

/**
 *  Filter a list of quote identifiers.
 *
 *  @rest
 *  @method POST
 *  @paths /quote/filter
 */
app.post('/quote/filter', function(req, res, next) {
  var quote = new Quote()
    , opts = {keys: req.body};

  if(!Array.isArray(req.body)) {
     var err = new Error('Array body expected');
     err.status = 400;
     return next(err);
  }

  quote.filter(opts, function(err, response, body) {
    if(err) {
      return next(err);
    }
    res.send(body);
  })
});

/**
 *  Get a count of all quotes.
 *
 *  @rest
 *  @method GET
 *  @paths /quote/count
 */
app.get('/quote/count', function(req, res, next) {
  var quote = new Quote()
    , opts = {reduce: true, include_docs: false};
  quote.list(opts, function(err, response, body) {
    if(err) {
      return next(err);
    }
    res.send({count: body.rows[0].value});
  })
});

/**
 *  Get a random quote.
 *
 *  @rest
 *  @method GET
 *  @paths /quote/count
 */
app.get('/quote/random', function(req, res, next) {
  var quote = new Quote()
    , opts = {last: req.query.last};
  quote.random(opts, function(err, response, body) {
    if(err) {
      return next(err);
    }
    res.send(body);
  })
});

/**
 *  Get a quote by identifier.
 *
 *  @rest
 *  @method GET
 *  @paths /quote/{id}
 */
app.get('/quote/:id', function(req, res, next) {
  var quote = new Quote()
    , opts = {id: req.params.id};
  quote.get(opts, function(err, response, body) {
    if(err) {
      return next(err);
    }
    res.send(body);
  })
});

app.all('*', function(req, res, next) {
  var err = new Error('not_found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  var doc = {
    status: err.status || 500,
    message: err.message || err.reason
  }
  if(!env.production) {
    doc.stack = (err.stack || '').split('\n');
  }
  res.status(doc.status).send(doc);
  next();
});

module.exports = app;
