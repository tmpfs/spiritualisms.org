var expect = require('chai').expect
  , Quote = require('../../../lib/model/quote');

describe('model:', function() {

  it('should list quotes', function(done) {
    var quote = new Quote();
    quote.list(null, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.rows).to.be.an('array')
        .to.have.length.gt(0);
      var quote = body.rows[0];
      expect(quote).to.be.an('object');
      expect(quote.id).to.be.a('string');
      expect(quote.doc).to.be.an('object');
      done();
    })
  })

})
