var Tag = require('../lib/model/tag')
  , getViewInfo = require('./view-info');

function routes(app) {

  app.get('/explore/tags', function(req, res, next) {
    var tag = new Tag()
      , info = getViewInfo(req);

    function done() {
      tag.getAllTags({}, function(err, response, body) {
        if(err) {
          return next(err); 
        }
        info.tags = body;
        res.render('explore/tags', info);
      });
    }

    // perform a search by tag(s)
    if(req.query.q) {
      var keys = req.query.q.split(/,?\s+/);

      // tags are normalized to lowercase in the db view
      keys = keys.map(function(key) {
        return key.toLowerCase();
      })

      tag.findByTags({keys: keys}, function(err, response, body) {
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
    // show tag listing
    }else{
      done();
    }
  });

  app.get('/explore/tags/:tag', function(req, res, next) {
    var tag = new Tag()
      , info = getViewInfo(req);

    info.tag = req.params.tag;

    tag.findByTags({keys: [req.params.tag]}, function(err, response, body) {
      if(err) {
        return next(err); 
      }
      info.quotes = body;
      res.render('explore/tags-listing', info);
    });
  });

}

module.exports = routes;
