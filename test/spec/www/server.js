var expect = require('chai').expect
  , request = require('request');

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
      url: process.env.WWW + '/home'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      done(); 
    })
  })

  it('should GET browser home page with trailing slash', function(done) {
    var opts = {
      url: process.env.WWW + '/home/',
      followRedirect: false
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(301);
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

  it('should GET contribute page', function(done) {
    var opts = {
      url: process.env.WWW + '/contribute'
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

  it('should GET stars page', function(done) {
    var opts = {
      url: process.env.WWW + '/stars'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      done(); 
    })
  })

  // docs
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

  it('should GET page not found', function(done) {
    var opts = {
      url: process.env.WWW + '/non-existent'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(404);
      done(); 
    })
  })

})
