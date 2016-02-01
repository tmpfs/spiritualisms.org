var express = require('express')
  , app = express();

app.get('/why', function(req, res) {
  res.send('why');
});

app.get('/donate', function(req, res) {
  res.send('donate');
});

app.get('/create', function(req, res) {
  res.send('create');
});

app.use(express.static(__dirname));

module.exports = app;
