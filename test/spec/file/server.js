var expect = require('chai').expect
  , request = require('request')
  , id = 'gone';

describe('file:', function() {

  it('should GET files index', function(done) {
    var opts = {
      url: process.env.FILES
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      done(); 
    })
  })

  it('should GET files download page', function(done) {
    var opts = {
      url: process.env.FILES + '/' + id
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      done(); 
    })
  })

  it('should GET 404 on bad file extension', function(done) {
    var opts = {
      url: process.env.FILES + '/' + id + '.foo'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(404);
      done(); 
    })
  })

  it('should GET 404 on bad identifier', function(done) {
    var opts = {
      url: process.env.FILES + '/non-existent'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(404);
      done(); 
    })
  })

  it('should GET 404 on bad route', function(done) {
    var opts = {
      url: process.env.FILES + '/non-existent/deep'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(404);
      done(); 
    })
  })

})
