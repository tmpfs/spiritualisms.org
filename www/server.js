var path = require('path')
  , express = require('express')
  , app = express()
  , env = require('nenv')()
  , getViewInfo = require('../lib/http/view-info')
  , slashes = require('../lib/http/slashes')
  , wildcard = require('../lib/http/wildcard')
  , errorView = require('../lib/http/error-view')
  , tags = require('./tags')
  , authors = require('./authors')
  , Quote = require('../lib/model/quote')
  , Tag = require('../lib/model/tag')
  , formats = require('../lib/formats')
  , staticOptions = {
      maxage: env.production ? '1y' : 0 
    }

if(!env.defined) {
  env.set(env.PRODUCTION);
}

app.disable('x-powered-by');
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'src'));
app.use(express.static(path.join(__dirname, 'public'), staticOptions));

app.use(slashes);

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

app.get('/', function(req, res, next) {
  random('index', req, res, next);
});

app.get('/home', function(req, res, next) {
  random('home', req, res, next);
});

app.get('/sitemap', function(req, res, next) {
  random('sitemap/index', req, res, next);
});

app.get('/about', function(req, res) {
  var info = getViewInfo(req);
  res.render('about', info);
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

tags(app);
authors(app);

app.get('/explore/:id\.:ext?', function(req, res, next) {
  var quote = new Quote()
    , info = getViewInfo(req)
    , id = req.params.id
    , ext = req.params.ext;

  quote.get({id: id}, function(err, response, body) {
    if(err) {
      return next(err); 
    }
    info.doc = body;
    info.doc.tags = Tag.convert(info.doc.tags);
    if(!ext) {
      res.render('quotation', info);
    }else{
      if(!formats.map[ext]) {
        err = new Error('not_found');
        err.status = 404;
        return next(err);
      }
      res.redirect(info.app.files + '/' + id + '.' + ext);
    }
  });
});

app.get('/stars', function(req, res) {
  var info = getViewInfo(req);
  res.render('stars', info);
});

app.get('/contribute', function(req, res) {
  var info = getViewInfo(req);
  res.render('contribute', info);
});

/*
app.get('/create', function(req, res) {
  var info = getViewInfo(req);
  res.render('create', info);
});
*/

// DOCS
app.get('/docs', function(req, res) {
  var info = getViewInfo(req);
  res.render('docs/index', info);
});

app.get('/docs/contribution-guidelines', function(req, res) {
  var info = getViewInfo(req);
  res.render('docs/contribution-guidelines', info);
});

app.get('/docs/privacy-policy', function(req, res) {
  var info = getViewInfo(req);
  res.render('docs/privacy-policy', info);
});

app.get('/docs/source-code', function(req, res) {
  var info = getViewInfo(req);
  res.render('docs/source-code', info);
});

app.get('/docs/browser-update', function(req, res) {
  var info = getViewInfo(req);
  res.render('docs/browser-update', info);
});

app.all('*', wildcard);
app.use(errorView);

module.exports = app;
