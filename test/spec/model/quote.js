var expect = require('chai').expect
  , Quote = require('../../../lib/model/quote');

describe('model:', function() {

  it('should list quotes', function(done) {
    var quote = new Quote();
    quote.list({}, function(err, res, body) {
      console.dir(err); 
      done();
    })
  })

})
