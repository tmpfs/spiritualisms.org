var path = require('path')
  , fs = require('fs')
  , express = require('express')
  , app = express()
  , buffer = require('./buffer')
  , slashes = require('../lib/http/slashes')
  , wildcard = require('../lib/http/wildcard')
  , errorView = require('../lib/http/error-view')
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
 *  When no query parameters are specified if the file does not exist it 
 *  is created and served to the client otherwise the version from disc is 
 *  served.
 *
 *  ## Routes
 * 
 *  GET / serves an index listing of all quotes and download links.
 *
 *  GET /:id serves a download page for a quote.
 *
 *  GET /:id\.:ext? serves a file for download.
 *
 *  ## Extensions
 *
 *  - md
 *  - txt
 *  - pdf
 *  - html
 *  - json
 *  - xml
 *  - jpg
 *
 *  ## Query Parameters
 *
 *  The `fresh` query parameter returns a file based on the latest 
 *  version of the document in the database, it does not serve files 
 *  from disc.
 *
 *  The `force` parameter switches the content type to 
 *  `application/octet-stream` and forces a download of the file.
 *
 *  For the .json file format a `pretty` query parameter will pretty print the 
 *  JSON document, this operation then becomes dynamic (implies `fresh`).
 *
 *  Examples
 *
 *  - /docid.jpg
 *  - /docid.pdf
 *  - /docid.json?pretty=1
 *  - /docid.txt?fresh=1
 *  - /docid.xml?force=1
 *  - /docid.html?fresh=1&force=1
 */
app.disable('x-powered-by');
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
    // force download the file: octet-stream
    , force = req.query.force
    // fresh dynamic response - latest (dynamic)
    , fresh = req.query.fresh
    // pretty print json output (dynamic)
    , pretty = req.query.pretty
    // document identifier
    , id = req.params.id
    // file extensions
    , ext = req.params.ext;

  function setResponseHeaders(buf) {
    var size = 0;

    // string or buffer
    if(buf && buf.length !== undefined) {
      size = buf.length; 
    }else{
      // NOTE: info.size is for stream types (pdf)
      // NOTE: when they are written first time around
      // NOTE: the write logic keeps track of the bytes written
      // NOTE: which saves an additional call to stat
      size = info.size || (info.stats ? info.stats.size : 0);
    }

    //console.log('size: %j', info.stats);
    //console.log('size: %s', info.size);
    //console.log('size: %s', size);

    // force download
    if(force) {
      res.set('Content-Description', 'File Transfer');
      res.set('Content-Type', 'application/octet-stream');
      res.set('Content-Disposition', 'attachment; filename="'
        + info.filename + '"'); 
      res.set('Content-Transfer-Encoding','binary');
      res.set('Connection', 'Keep-Alive');
      res.set('Expires', '0');
      res.set('Cache-Control', 'must-revalidate, post-check=0, pre-check=0');
      res.set('Pragma', 'public');
    }else{
      // set content type header
      res.set('Content-Type', formats.mime[ext]);
    }

    res.set('Content-Length', size);
  }

  function sendFile() {
    setResponseHeaders();
    // TODO: add try/catch, EMFILE etc?
    var readable = fs.createReadStream(info.filepath);
    // TODO: log file stream errors
    readable.pipe(res);
  }

  function sendBuffer(buf) {
    setResponseHeaders(buf);
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

    // have to buffer stream for force/fresh download on streams
    if((fresh || force) && ext === formats.PDF) {
      return buffer(buf.stream, function(err, buf) {
        if(err) {
          return next(err);
        } 
        info.size = buf.length;
        sendBuffer(buf); 
      }) 
    }

    if(fresh) {
      return sendBuffer(buf); 
    }

    if(info.stats) {
      formats.write(info, buf, onWrite);
    // need to get file stats for first time lazy creation
    // after file is compiled
    }else{
      formats.write(info, buf, function(err) {
        if(err) {
          return next(err); 
        } 
        fs.stat(info.filepath, function(err, stats) {
          if(err) {
            return next(err); 
          }
          info.stats = stats;
          onWrite();
        })
      });
    }
  }

  // check if file exists
  function onStat(err, stats) {
    var exists = !err && stats;
    if(err && err.code !== 'ENOENT') {
      return next(err); 
    }
    info.stats = stats;
    if(fresh || !exists) {
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

      info.filename = id + '.' + ext;
      info.ext = ext;
      info.mime = formats.mime[ext];
      info.filepath = path.join(files, info.filename);

      if(ext === formats.JSON && pretty) {
        // no need for nested object (JSON only)
        info.doc.tags = info.doc.tags.rows;

        var buf = JSON.stringify(info.doc, undefined, 2);
        return sendBuffer(buf);
      }

      fs.stat(info.filepath, onStat);
    }
  });
});

app.all('*', wildcard);
app.use(errorView);

module.exports = app;
