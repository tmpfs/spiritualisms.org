var expect = require('chai').expect
  , request = require('request')
  , Quote = require('../../../lib/model/quote');

describe('www:', function() {

  it('should GET website home page', function(done) {
    var opts = {
      url: process.env.WWW
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      done(); 
    })
  })

  it('should GET browser home page', function(done) {
    var opts = {
      url: process.env.WWW + '/home-page'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      done(); 
    })
  })

  it('should GET why page', function(done) {
    var opts = {
      url: process.env.WWW + '/why'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      done(); 
    })
  })

  it('should GET inspire page', function(done) {
    var opts = {
      url: process.env.WWW + '/inspire'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      done(); 
    })
  })

  it('should GET inspire quote page', function(done) {
    var quote = new Quote();
    quote.list({}, function(err, res, body) {
      expect(err).to.eql(null);
      expect(body).to.be.an('object');
      var opts = {
        url: process.env.WWW + '/inspire/' +  body.rows[0].id
      }
      request(opts, function(err, res) {
        expect(err).to.eql(null);
        expect(res.statusCode).to.eql(200);
        done(); 
      })
    })
  })

  it('should GET donate page', function(done) {
    var opts = {
      url: process.env.WWW + '/donate'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      done(); 
    })
  })

  it('should GET create page', function(done) {
    var opts = {
      url: process.env.WWW + '/create'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      done(); 
    })
  })

  it('should GET contributing page', function(done) {
    var opts = {
      url: process.env.WWW + '/contributing'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      done(); 
    })
  })

})
