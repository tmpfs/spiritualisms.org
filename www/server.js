var path = require('path')
  , express = require('express')
  , app = express()
  , Quote = require('../lib/model/quote');

app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'src'));

/**
 *  Helper function to pass a random quote to a view.
 */
function random(view, req, res, next) {
  var quote = new Quote();
  quote.random({}, function(err, response, body) {
    if(err) {
      return next(err); 
    } 
    res.render(view, {doc: body});
  })
}

app.get('/', function(req, res, next) {
  random('index', req, res, next);
});

app.get('/home-page', function(req, res, next) {
  random('home-page', req, res, next);
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
    res.render('quotation', {doc: body});
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
  //console.dir(err);
  res.status(err.status || 500)
    .render('error',
      {
        status: err.status || 500,
        doc: err.doc,
        res: err.res,
        stack: err.stack
      }
    );
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
