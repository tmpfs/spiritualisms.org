var path = require('path')
  , express = require('express')
  , app = express()
  , slashes = require('../lib/http/slashes')
  , getViewInfo = require('../lib/http/view-info')
  , Quote = require('../lib/model/quote')
  , formats = require('../lib/formats');

app.set('view engine', 'jade');
app.set('views', path.join(__dirname, '/../www/src'));
app.use(express.static(path.join(__dirname, '/../www/public')));

app.use(slashes);

/**
 *  Get file list.
 */
app.get('/', function(req, res) {
  var info = getViewInfo(req);
  res.render('files/index', info);
});

/**
 *  Get file page.
 */
app.get('/:id\.:ext?', function(req, res, next) {
    var quote = new Quote()
      , info = getViewInfo(req);
    quote.get({id: req.params.id}, function(err, response, body) {
      if(err) {
        return next(err); 
      }
      console.log(body);
      info.doc = body;
      //info.doc.tags = Tag.convert(info.doc.tags);
      if(!req.params.ext) {
        res.render('files/page', info);
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

app.all('*', function(req, res, next) {
  var err = new Error('not_found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  var info = getViewInfo(req);
  /* istanbul ignore next: assume internal server error */
  info.status = err.status || 500;
  info.message = err.message || err.reason;
  info.doc = err.doc;
  info.res = err.res;
  info.stack = err.stack;
  res.status(info.status).render('error', info);
  next();
});

module.exports = app;
