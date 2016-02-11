var expect = require('chai').expect
  , request = require('request');

describe('api:', function() {
  var quotes;

  before(function(done) {
    var opts = {
      url: process.env.API + '/quote',
      json: true
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      quotes = res.body;
      done(); 
    })
  })

  it('should POST to increment amount of love', function(done) {
    var opts = {
      url: process.env.API + '/quote/' + quotes.rows[0].id + '/love',
      json: true,
      method: 'POST'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      var body = res.body;
      expect(body).to.be.an('object')
      expect(Object.keys(body)).to.be.an('array')
        .to.have.length.gt(0);
      expect(body[Object.keys(body)[0]]).to.be.a('number');
      done(); 
    })
  })

  it('should GET amount of love', function(done) {
    var opts = {
      url: process.env.API + '/quote/' + quotes.rows[0].id + '/love',
      json: true
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      var body = res.body;
      expect(body).to.be.an('object')
      expect(Object.keys(body)).to.be.an('array')
        .to.have.length.gt(0);
      expect(body[Object.keys(body)[0]]).to.be.a('number');
      done(); 
    })
  })

  it('should POST for love map', function(done) {
    var ids = [];
    quotes.rows.forEach(function(row) {
      ids.push(row.id); 
    })
    var opts = {
      url: process.env.API + '/quote/love',
      method: 'POST',
      json: true,
      body: ids
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      var body = res.body;
      expect(body).to.be.an('object')
      expect(Object.keys(body)).to.be.an('array')
        .to.have.length.gt(0);
      expect(body[Object.keys(body)[0]]).to.be.a('number');
      done(); 
    })
  })

})
