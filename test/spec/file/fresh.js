var fs = require('fs')
  , path = require('path')
  , formats = require('../../../lib/formats')
  , files = path.normalize(__dirname + '/../../../www/public/files')
  , expect = require('chai').expect
  , request = require('request')
  , id = 'gone';

describe('file (?fresh=1):', function() {

  // ensure files do not exist
  before(function(done) {
    formats.list.forEach(function(ext) {
      var file = files + '/' + id + '.' + ext;
      try {
        fs.unlinkSync(file);
      }catch(e){}
    }) 
    done();
  })

  it('should GET markdown document', function(done) {
    var opts = {
      url: process.env.FILES + '/' + id + '.md?fresh=1'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      expect(parseInt(res.headers['content-length'])).to.be.gt(0);
      expect(res.headers['content-type']).to.eql(
        'text/markdown; charset=utf-8');
      done(); 
    })
  })

  it('should GET text document', function(done) {
    var opts = {
      url: process.env.FILES + '/' + id + '.txt?fresh=1'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      expect(parseInt(res.headers['content-length'])).to.be.gt(0);
      expect(res.headers['content-type']).to.eql(
        'text/plain; charset=utf-8');
      done(); 
    })
  })

  it('should GET pdf document', function(done) {
    var opts = {
      url: process.env.FILES + '/' + id + '.pdf?fresh=1'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      expect(parseInt(res.headers['content-length'])).to.be.gt(0);
      expect(res.headers['content-type']).to.eql(
        'application/pdf');
      done(); 
    })
  })

  it('should GET json document', function(done) {
    var opts = {
      url: process.env.FILES + '/' + id + '.json?fresh=1'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      expect(parseInt(res.headers['content-length'])).to.be.gt(0);
      expect(res.headers['content-type']).to.eql(
        'application/json; charset=utf-8');
      done(); 
    })
  })

  it('should GET pretty json document', function(done) {
    var opts = {
      url: process.env.FILES + '/' + id + '.json?pretty=1&fresh=1'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      expect(parseInt(res.headers['content-length'])).to.be.gt(0);
      expect(res.headers['content-type']).to.eql(
        'application/json; charset=utf-8');
      done(); 
    })
  })

  it('should GET html document', function(done) {
    var opts = {
      url: process.env.FILES + '/' + id + '.html?fresh=1'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      expect(parseInt(res.headers['content-length'])).to.be.gt(0);
      expect(res.headers['content-type']).to.eql(
        'text/html; charset=utf-8');
      done(); 
    })
  })

  it('should GET xml document', function(done) {
    var opts = {
      url: process.env.FILES + '/' + id + '.xml?fresh=1'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      expect(parseInt(res.headers['content-length'])).to.be.gt(0);
      expect(res.headers['content-type']).to.eql(
        'text/xml; charset=utf-8');
      done(); 
    })
  })

})
