var express = require('express')
  , app = express()
  , pkg = require('../package.json')
  , bodyParser = require('body-parser')
  , info = JSON.stringify({name: pkg.name, version: pkg.version})
  , cors = require('./cors')
  , Quote = require('../lib/model/quote');

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

app.get('/', function(req, res) {
  res.send(info)
});

/**
 *  @rest
 *
 *  Get a list of quotes.
 *
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
 */
app.post('/quote', function(req, res, next) {
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
 *  Get a count of all quotes.
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
 */
app.get('/quote/random', function(req, res, next) {
  var quote = new Quote()
    , opts = {};
  quote.random(opts, function(err, response, body) {
    if(err) {
      return next(err);
    }
    res.send(body);
  })
});

/**
 *  Get the love counters for an array of quote identifiers.
 */
app.post('/quote/love', function(req, res, next) {
  var quote = new Quote()
    , opts = {ids: req.body}
    , err;

  if(!Array.isArray(req.body)) {
     err = new Error('Array body expected');
     err.status = 400;
     return next(err);
  }

  quote.getLoveMulti(opts, function(err, response) {
    if(err) {
      return next(err);
    }
    res.send(response);
  })
});

/**
 *  Get the star counters for an array of quote identifiers.
 */
app.post('/quote/star', function(req, res, next) {
  var quote = new Quote()
    , opts = {ids: req.body}
    , err;

  if(!Array.isArray(req.body)) {
     err = new Error('Array body expected');
     err.status = 400;
     return next(err);
  }

  quote.getStarMulti(opts, function(err, response) {
    if(err) {
      return next(err);
    }
    res.send(response);
  })
});


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

// LOVE

app.get('/quote/:id/love', function(req, res, next) {
  var quote = new Quote()
    , opts = {id: req.params.id};
  quote.getLove(opts, function(err, response) {
    if(err) {
      return next(err);
    }
    res.send(response);
  })
});

app.post('/quote/:id/love', function(req, res, next) {
  var quote = new Quote()
    , opts = {id: req.params.id};
  quote.showLove(opts, function(err, response) {
    if(err) {
      return next(err);
    }
    res.send(response);
  })
});

// STAR

app.get('/quote/:id/star', function(req, res, next) {
  var quote = new Quote()
    , opts = {id: req.params.id};
  quote.getStar(opts, function(err, response) {
    if(err) {
      return next(err);
    }
    res.send(response);
  })
});

app.post('/quote/:id/star', function(req, res, next) {
  var quote = new Quote()
    , opts = {id: req.params.id};
  quote.addStar(opts, function(err, response) {
    if(err) {
      return next(err);
    }
    res.send(response);
  })
});

app.delete('/quote/:id/star', function(req, res, next) {
  var quote = new Quote()
    , opts = {id: req.params.id};
  quote.removeStar(opts, function(err, response) {
    if(err) {
      return next(err);
    }
    res.send(response);
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
  res.status(doc.status).send(doc);
  next();
});

module.exports = app;
