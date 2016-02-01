var path = require('path')
  , express = require('express')
  , app = express()
  , Quote = require('../lib/model/quote');

app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'src'));

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/home-page', function(req, res) {
  res.render('home-page');
});

app.get('/why', function(req, res) {
  res.render('why');
});

app.get('/inspire', function(req, res, next) {
  var quote = new Quote();
  quote.list({}, function(err, response, body) {
    if(err) {
      return next(err); 
    }
    res.render('inspire', {quotes: body});
  });
});

app.get('/inspire/:id', function(req, res, next) {
  var quote = new Quote();
  quote.get({id: req.params.id}, function(err, response, body) {
    if(err) {
      return next(err); 
    }
    res.render('quotation', {quotation: body});
  });
});

app.get('/donate', function(req, res) {
  res.render('donate');
});

app.get('/create', function(req, res) {
  res.render('create');
});

app.get('/contributing', function(req, res) {
  res.render('contributing');
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500)
    .render('error', {status: err.status, doc: err.doc, req: err.res});
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
