var path = require('path')
  , express = require('express')
  , app = express();

app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'src'));

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/why', function(req, res) {
  res.send('why');
});

app.get('/donate', function(req, res) {
  res.send('donate');
});

app.get('/create', function(req, res) {
  res.send('create');
});

app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
