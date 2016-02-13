var Love = require('../lib/model/love');

function routes(app) {

  /**
   *  Get the love counters for an array of quote identifiers.
   *
   *  @rest
   *  @method POST
   *  @paths /quote/count
   */
  app.post('/quote/love', function(req, res, next) {
    var love = new Love()
      , opts = {ids: req.body}
      , err;

    if(!Array.isArray(req.body)) {
      err = new Error('Array body expected');
      err.status = 400;
      return next(err);
    }

    love.getLoves(opts, function(err, response) {
      if(err) {
        return next(err);
      }
      res.send(response);
    })
  });

  /**
   *  Get the love counter for a quote.
   *
   *  @rest
   *  @method GET
   *  @paths /quote/{id}/love
   */
  app.get('/quote/:id/love', function(req, res, next) {
    var love = new Love()
      , opts = {id: req.params.id};
    love.getLove(opts, function(err, response) {
      if(err) {
        return next(err);
      }
      res.send(response);
    })
  });

  /**
   *  Increment the love counter for a quote.
   *
   *  @rest
   *  @method POST
   *  @paths /quote/{id}/love
   */
  app.post('/quote/:id/love', function(req, res, next) {
    var love = new Love()
      , opts = {id: req.params.id};
    love.addLove(opts, function(err, response) {
      if(err) {
        return next(err);
      }
      res.send(response);
    })
  });

}

module.exports = routes;
