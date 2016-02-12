var path = require('path')
  , fs = require('fs')
  , express = require('express')
  , app = express()
  , slashes = require('../lib/http/slashes')
  , getViewInfo = require('../lib/http/view-info')
  , Quote = require('../lib/model/quote')
  , Tag = require('../lib/model/tag')
  , formats = require('../lib/formats')
  // file storage directory
  , files = path.normalize(path.join(__dirname + '/../www/public/files'));

/**
 *  Static and dynamic caching file download service.
 *
 *  By design this does not use couchdb attachments as that would 
 *  create new revisions and increase the size of the database.
 * 
 *  GET / serves an index listing of all quotes and download links.
 *
 *  GET /:id serves a download page for a quote.
 *
 *  GET /:id\.:ext? serves a file for download.
 *
 *  Query
 *
 *  All file formats support the `fresh` query parameter which returns a 
 *  file based on the latest version of the document in the database.
 *
 *  For the .json file format a `pretty` query parameter will pretty print the 
 *  JSON document, this operation then becomes dynamic.
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
      , pretty = req.query.pretty
      // document identifier
      , id = req.params.id
      // file extensions
      , ext = req.params.ext;

    function setResponseHeaders() {
      // set content type header
      res.set('content-type', formats.mime[ext]);
    }

    function sendFile() {
      setResponseHeaders();

      // TODO: add try/catch, EMFILE etc?
      var readable = fs.createReadStream(info.filepath);
      // TODO: log file stream errors
      readable.pipe(res);
    }

    function sendBuffer(buf) {
      setResponseHeaders();
      if(typeof buf === 'object' && buf.stream) {
        buf.stream.pipe(res);
      }else{
        res.end(buf);
      }
    }

    function onWrite(err) {
      if(err) {
        return next(err); 
      } 
      sendFile();
    }

    function onCompile(err, buf) {
      if(err) {
        return next(err); 
      }
      if(fresh) {
        return sendBuffer(buf); 
      }
      formats.write(info, buf, onWrite);
    }

    // check if file exists
    function exists(file) {
      if(fresh || !file) {
        return formats.compile[ext](info, onCompile);
      }else{
        sendFile();
      }
    }

    // fetch document from the database
    quote.get({id: id, raw: true}, function(err, response, body) {

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
      if(!ext) {
        res.render('files/page', info);
      }else{

        // unsupported file extension
        if(!formats.map[ext]) {
          err = new Error('not_found');
          err.status = 404;
          return next(err);
        }

        if(ext === formats.JSON && pretty) {
          return sendBuffer(JSON.stringify(info.doc, undefined, 2));
        }

        info.filename = id + '.' + ext;
        info.ext = ext;
        info.mime = formats.mime[ext];
        info.filepath = path.join(files, info.filename);

        fs.exists(info.filepath, exists);
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
