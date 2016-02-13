var Star = require('../lib/model/star');

function routes(app) {

  /**
   *  Get the star counters for an array of quote identifiers.
   *
   *  @rest
   *  @method POST
   *  @paths /quote/count
   */
  app.post('/quote/star', function(req, res, next) {
    var star = new Star()
      , opts = {ids: req.body}
      , err;

    if(!Array.isArray(req.body)) {
      err = new Error('Array body expected');
      err.status = 400;
      return next(err);
    }

    star.getStars(opts, function(err, response) {
      if(err) {
        return next(err);
      }
      res.send(response);
    })
  });

  /**
   *  Decrement the star counter for multiple quotes.
   *
   *  @rest
   *  @method DELETE
   *  @paths /quote/star
   */
  app.delete('/quote/star', function(req, res, next) {
    var star = new Star()
      , opts = {keys: req.body};

    if(!Array.isArray(req.body)) {
      var err = new Error('Array body expected');
      err.status = 400;
      return next(err);
    }

    star.removeStars(opts, function(err, response) {
      if(err) {
        return next(err);
      }
      res.send(response);
    })
  });

  /**
   *  Get the star counter for a quote.
   *
   *  @rest
   *  @method GET
   *  @paths /quote/{id}/star
   */
  app.get('/quote/:id/star', function(req, res, next) {
    var star = new Star()
      , opts = {id: req.params.id};
    star.getStar(opts, function(err, response) {
      if(err) {
        return next(err);
      }
      res.send(response);
    })
  });

  /**
   *  Increment the star counter for a quote.
   *
   *  @rest
   *  @method POST
   *  @paths /quote/{id}/star
   */
  app.post('/quote/:id/star', function(req, res, next) {
    var star = new Star()
      , opts = {id: req.params.id};
    star.addStar(opts, function(err, response) {
      if(err) {
        return next(err);
      }
      res.send(response);
    })
  });

  /**
   *  Increment the star counter for multiple quotes.
   *
   *  @rest
   *  @method PUT
   *  @paths /quote/star
   */
  app.put('/quote/star', function(req, res, next) {
    var star = new Star()
      , opts = {};

    if(!Array.isArray(req.body)) {
      var err = new Error('Array body expected');
      err.status = 400;
      return next(err);
    }

    opts.keys = req.body;

    star.addStars(opts, function(err, body) {
      if(err) {
        return next(err);
      }
      res.send(body);
    })
  });

  /**
   *  Decrement the star counter for a quote.
   *
   *  @rest
   *  @method DELETE
   *  @paths /quote/{id}/star
   */
  app.delete('/quote/:id/star', function(req, res, next) {
    var star = new Star()
      , opts = {id: req.params.id};
    star.removeStar(opts, function(err, response) {
      if(err) {
        return next(err);
      }
      res.send(response);
    })
  });

}

module.exports = routes;
