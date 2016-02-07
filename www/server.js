var path = require('path')
  , url = require('url')
  , express = require('express')
  , app = express()
  , env = require('nenv')()
  , Quote = require('../lib/model/quote')
  , formats = require('../lib/formats');

app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'src'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  if(req.url.substr(-1) === '/' && req.url.length > 1) {
    res.redirect(301, req.url.slice(0, -1));
  }else{
    next();
  }
});

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
  o.uri = url.parse(req.url);
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

app.get('/explore', function(req, res, next) {
  var quote = new Quote()
    , info = getViewInfo(req);
  quote.list({}, function(err, response, body) {
    if(err) {
      return next(err); 
    }
    info.quotes = body;
    res.render('explore', info);
  });
});

app.get('/explore/:id\.:ext?', function(req, res, next) {
    var quote = new Quote()
      , info = getViewInfo(req);
    quote.get({id: req.params.id}, function(err, response, body) {
      if(err) {
        return next(err); 
      }
      info.doc = body;
      if(!req.params.ext) {
        res.render('quotation', info);
      }else{
        if(!formats.map[req.params.ext]) {
          err = new Error('not_found');
          err.status = 404;
          return next(err);
        }
        formats.map[req.params.ext](info, req, res, next);
      }
    });
});

app.get('/contribute', function(req, res) {
  var info = getViewInfo(req);
  res.render('contribute', info);
});

app.get('/create', function(req, res) {
  var info = getViewInfo(req);
  res.render('create', info);
});

app.get('/contributing', function(req, res) {
  var info = getViewInfo(req);
  res.render('contributing', info);
});

app.all('*', function(req, res, next) {
  var err = new Error('not_found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  var info = getViewInfo(req);
  info.status = err.status || 500;
  info.message = err.message || err.reason;
  info.doc = err.doc;
  info.res = err.res;
  info.stack = err.stack;
  res.status(info.status).render('error', info);
  next();
});

module.exports = app;
