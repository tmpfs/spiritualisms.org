var expect = require('chai').expect
  , request = require('request');

describe('api:', function() {
  var quotes;

  before(function(done) {
    var opts = {
      url: process.env.API + '/quote'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      var body = JSON.parse(res.body);
      quotes = body;
      done(); 
    })
  })

  it('should POST to increment amount of love', function(done) {
    var opts = {
      url: process.env.API + '/quote/' + quotes.rows[0].id + '/love',
      method: 'POST'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      var body = JSON.parse(res.body);
      expect(body.id).to.be.a('string')
        .to.eql(quotes.rows[0].id);
      expect(body.love).to.be.a('number');
      done(); 
    })
  })

  it('should GET amount of love', function(done) {
    var opts = {
      url: process.env.API + '/quote/' + quotes.rows[0].id + '/love'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      var body = JSON.parse(res.body);
      expect(body.id).to.be.a('string')
        .to.eql(quotes.rows[0].id);
      expect(body.love).to.be.a('number');
      done(); 
    })
  })

})
