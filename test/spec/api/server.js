var expect = require('chai').expect
  , request = require('request');

describe('api:', function() {
  var quotes;

  it('should GET info', function(done) {
    var opts = {
      url: process.env.API
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      var body = JSON.parse(res.body);
      expect(body.version).to.be.a('string');
      expect(body.name).to.be.a('string');
      done(); 
    })
  })

  it('should GET quote list', function(done) {
    var opts = {
      url: process.env.API + '/quote'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      var body = JSON.parse(res.body);
      quotes = body;
      expect(body.rows).to.be.an('array')
        .to.have.length.gt(0);
      done(); 
    })
  })

  it('should GET quote count', function(done) {
    var opts = {
      url: process.env.API + '/quote/count'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      var body = JSON.parse(res.body);
      expect(body.count).to.be.a('number');
      done(); 
    })
  })

  it('should GET single quote', function(done) {
    var opts = {
      url: process.env.API + '/quote/' + quotes.rows[0].id
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      var body = JSON.parse(res.body);
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

  it('should GET random quote', function(done) {
    var opts = {
      url: process.env.API + '/quote/random'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      var body = JSON.parse(res.body);
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

  it('should GET 404 on missing quote', function(done) {
    var opts = {
      url: process.env.API + '/quote/non-existent'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(404);
      var body = JSON.parse(res.body);
      expect(body.status).to.eql(404);
      done(); 
    })
  })


})
