var path = require('path')
  , fs = require('fs')
  , express = require('express')
  , app = express()
  , slashes = require('../lib/http/slashes')
  , getViewInfo = require('../lib/http/view-info')
  , Quote = require('../lib/model/quote')
  , Tag = require('../lib/model/tag')
  , formats = require('../lib/formats');

/**
 *  Static and dynamic file download service.
 *
 *  By design this does not use couchdb attachments as that would 
 *  create new revisions and increase the size of the database.
 * 
 *  GET / serves an index listing of all quotes and download links.
 *
 *  GET /:id serves a download page for a quote.
 *
 *  GET /:id\.:ext? serves a file for download
 */

app.set('view engine', 'jade');
app.set('views', path.join(__dirname, '/../www/src'));

app.use(express.static(path.join(__dirname, '/../www/public')));

app.use(slashes);

/**
 *  Get file list.
 */
app.get('/', function(req, res, next) {
  var quote = new Quote()
    , info = getViewInfo(req);
  quote.list({}, function(err, response, body) {
    if(err) {
      return next(err); 
    }
    info.quotes = body;
    res.render('files/index', info);
  });
});

/**
 *  Get file download page or file by extension.
 */
app.get('/:id\.:ext?', function(req, res, next) {
    var quote = new Quote()
      , info = getViewInfo(req)
      // fresh dynamic response - latest (dynamic)
      , fresh = req.query.fresh
      // pretty print json output (dynamic)
      , pretty = req.query.pretty;

    // fetch document from the database
    quote.get({id: req.params.id, raw: true}, function(err, response, body) {

      // database error, 404 errors are caught here
      if(err) {
        return next(err); 
      }

      // only serve published quotes
      if(body.publish !== true) {
        err = new Error('not_found');
        err.status = 404;
        return next(err);
      }

      // inject document into view information
      info.doc = Quote.normalize(body);
      info.doc.tags = Tag.convert(info.doc.tags);

      // no extension, serve download page
      if(!req.params.ext) {
        res.render('files/page', info);
      }else{

        // unsupported file extension
        if(!formats.map[req.params.ext]) {
          err = new Error('not_found');
          err.status = 404;
          return next(err);
        }

        // set content type header
        res.set('content-type', formats.mime[req.params.ext]);

        if(req.params.ext === formats.JSON && pretty) {
          return res.send(JSON.stringify(info.doc, undefined, 2));  
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
