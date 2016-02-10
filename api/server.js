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
 *  Get the love counters for an array of quote identifiers.
 *
 *  @rest
 *  @method POST
 *  @paths /quote/count
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
 *
 *  @rest
 *  @method POST
 *  @paths /quote/count
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

  quote.getStars(opts, function(err, response) {
    if(err) {
      return next(err);
    }
    res.send(response);
  })
});

/**
 *  Decrement the star counter for multiple quotes.
 *
 *  @rest
 *  @method DELETE
 *  @paths /quote/star
 */
app.delete('/quote/star', function(req, res, next) {
  var quote = new Quote()
    , opts = {keys: req.body};

  if(!Array.isArray(req.body)) {
     var err = new Error('Array body expected');
     err.status = 400;
     return next(err);
  }

  quote.removeStars(opts, function(err, response) {
    if(err) {
      return next(err);
    }
    res.send(response);
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

// LOVE

/**
 *  Get the love counter for a quote.
 *
 *  @rest
 *  @method GET
 *  @paths /quote/{id}/love
 */
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

/**
 *  Increment the love counter for a quote.
 *
 *  @rest
 *  @method POST
 *  @paths /quote/{id}/love
 */
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

/**
 *  Get the star counter for a quote.
 *
 *  @rest
 *  @method GET
 *  @paths /quote/{id}/star
 */
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

/**
 *  Increment the star counter for a quote.
 *
 *  @rest
 *  @method POST
 *  @paths /quote/{id}/star
 */
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

/**
 *  Decrement the star counter for a quote.
 *
 *  @rest
 *  @method DELETE
 *  @paths /quote/{id}/star
 */
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
