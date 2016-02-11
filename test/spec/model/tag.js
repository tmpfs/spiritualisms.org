var expect = require('chai').expect
  , Tag = require('../../../lib/model/tag');

describe('tag model:', function() {

  it('should find quotes by tags', function(done) {
    var tag = new Tag()
      , opts = {
        keys: ['food', 'love']
      };
    tag.findByTags(opts, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.rows).to.be.an('array');
      expect(body.rows.length).to.be.gt(0);
      expect(body.rows[0]).to.be.an('object');
      done();
    })
  })

  it('should get all tags', function(done) {
    var tag = new Tag()
      , opts = {};
    tag.getAllTags(opts, function(err, res, body) {
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
