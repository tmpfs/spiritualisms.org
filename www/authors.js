var Author = require('../lib/model/author')
  , getViewInfo = require('../lib/http/view-info');

function routes(app) {

  app.get('/explore/authors', function(req, res, next) {
    var author = new Author()
      , info = getViewInfo(req);

    function done() {
      author.getAllAuthors({}, function(err, response, body) {
        if(err) {
          return next(err); 
        }
        info.authors = body;
        res.render('explore/authors', info);
      });
    }

    // perform a search by author(s)
    if(req.query.q) {
      var keys = req.query.q.split(/,?\s+/);

      // authors are normalized to lowercase in the db view
      keys = keys.map(function(key) {
        return key.toLowerCase();
      })

      author.findByAuthors({keys: keys}, function(err, response, body) {
        if(err) {
          return next(err); 
        }
        info.search = {
          query: req.query.q,
          keys: keys,
          total: body.rows.length,
          quotes: body
        }
        done(); 
      });
    // show author listing
    }else{
      done();
    }
  });

  app.get('/explore/authors/:author', function(req, res, next) {
    var author = new Author()
      , info = getViewInfo(req);

    info.author = Author.titleCase(req.params.author);

    author.findByAuthors({keys: [req.params.author]},
      function(err, response, body) {
        if(err) {
          return next(err); 
        }
        info.quotes = body;
        res.render('explore/authors-listing', info);
      }
    );
  });

}

module.exports = routes;
