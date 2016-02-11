var expect = require('chai').expect
  , Author = require('../../../lib/model/author');

describe('author model:', function() {

  it('should find quotes by authors', function(done) {
    var author = new Author()
      , opts = {
        keys: ['Rumi']
      };
    author.findByAuthors(opts, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.rows).to.be.an('array');
      expect(body.rows.length).to.be.gt(0);
      expect(body.rows[0]).to.be.an('object');
      done();
    })
  })

  it('should get all authors', function(done) {
    var author = new Author()
      , opts = {};
    author.getAllAuthors(opts, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.rows).to.be.an('array');
      expect(body.rows.length).to.be.gt(0);
      expect(body.rows[0]).to.be.an('object');
      expect(body.rows[0].key).to.be.a('string');
      expect(body.rows[0].value).to.be.a('number');
      done();
    })
  })

})
