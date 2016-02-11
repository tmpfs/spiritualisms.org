var path = require('path')
  , express = require('express')
  , app = express()
  , env = require('nenv')()
  , slashes = require('../lib/http/slashes')
  , pkg = require('../package.json')
  , info = JSON.stringify({name: pkg.name, version: pkg.version});
  //, Quote = require('../lib/model/quote')
  //, formats = require('../lib/formats');

app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'src'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(slashes);

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
