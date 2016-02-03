var path = require('path')
  , express = require('express')
  , app = express()
  , env = require('nenv')()
  , Quote = require('../lib/model/quote');

app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'src'));

/**
 *  Helper function to pass a random quote to a view.
 */
function random(view, req, res, next) {
  var quote = new Quote()
    , info = getViewInfo(req);
  quote.random({}, function(err, response, body) {
    if(err) {
      return next(err); 
    } 
    info.doc = body;
    res.render(view, info);
  })
}

/**
 *  Helper function to get default view information.
 */
function getViewInfo(req) {
  var o = {};
  o.url = req.url;
  o.app = {
    api: process.env.API || 'http://localhost:3001'
  }
  o.env = env;
  return o;
}

app.get('/', function(req, res, next) {
  random('index', req, res, next);
});

app.get('/home', function(req, res, next) {
  random('home', req, res, next);
});

app.get('/why', function(req, res) {
  var info = getViewInfo(req);
  res.render('why', info);
});

app.get('/inspire', function(req, res, next) {
  var quote = new Quote()
    , info = getViewInfo(req);
  quote.list({}, function(err, response, body) {
    if(err) {
      return next(err); 
    }
    info.quotes = body;
    res.render('inspire', info);
  });
});

app.get('/inspire/:id', function(req, res, next) {
  var quote = new Quote()
    , info = getViewInfo(req);
  quote.get({id: req.params.id}, function(err, response, body) {
    if(err) {
      return next(err); 
    }
    info.doc = body;
    res.render('quotation', info);
  });
});

app.get('/donate', function(req, res) {
  var info = getViewInfo(req);
  res.render('donate', info);
});

app.get('/create', function(req, res) {
  var info = getViewInfo(req);
  res.render('create', info);
});

app.get('/contributing', function(req, res) {
  var info = getViewInfo(req);
  res.render('contributing', info);
});

app.use(function(err, req, res, next) {
  //console.dir(err);
  res.status(err.status || 500)
    .render('error',
      {
        status: err.status || 500,
        doc: err.doc,
        res: err.res,
        stack: err.stack
      }
    );
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
