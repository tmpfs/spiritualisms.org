var expect = require('chai').expect
  , Quote = require('../../../lib/model/quote');

describe('model:', function() {
  var quotes;

  it('should list quotes', function(done) {
    var quote = new Quote();
    quote.list(null, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.rows).to.be.an('array')
        .to.have.length.gt(0);
      // stash for later tests
      quotes = body;

      var quote = body.rows[0];
      expect(quote).to.be.an('object');
      expect(quote.id).to.be.a('string');
      expect(quote.doc).to.be.an('object');
      done();
    })
  })

  it('should get quote', function(done) {
    var quote = new Quote()
      , opts = {id: quotes.rows[0].id};
    quote.get(opts, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.id).to.be.a('string');
      expect(body.link).to.be.a('string');
      expect(body.domain).to.be.a('string');
      expect(body.quote).to.be.a('string');
      expect(body.author).to.be.a('string');
      expect(body.created).to.be.a('number');
      expect(body.tags).to.be.an('array');
      done();
    })
  })

})
