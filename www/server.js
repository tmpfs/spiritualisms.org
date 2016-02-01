var path = require('path')
  , express = require('express')
  , app = express();

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

app.get('/inspire', function(req, res) {
  res.render('inspire');
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

app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
