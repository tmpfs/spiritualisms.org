var fs = require('fs')
  , path = require('path')
  , formats = require('../../../lib/formats')
  , files = path.normalize(__dirname + '/../../../www/public/files')
  , expect = require('chai').expect
  , request = require('request')
  , id = 'gone';

function assert(res) {
  expect(res.statusCode).to.eql(200);
  expect(parseInt(res.headers['content-length'])).to.be.gt(0);
  expect(res.headers['content-type']).to.eql(
    'application/octet-stream');
}

describe('file (?force=1&fresh=1):', function() {

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
      url: process.env.FILES + '/' + id + '.md?force=1&fresh=1'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      assert(res);
      done(); 
    })
  })

  it('should GET text document', function(done) {
    var opts = {
      url: process.env.FILES + '/' + id + '.txt?force=1&fresh=1'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      assert(res);
      done(); 
    })
  })

  it('should GET pdf document', function(done) {
    var opts = {
      url: process.env.FILES + '/' + id + '.pdf?force=1&fresh=1'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      assert(res);
      done(); 
    })
  })

  it('should GET json document', function(done) {
    var opts = {
      url: process.env.FILES + '/' + id + '.json?force=1&fresh=1'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      assert(res);
      done(); 
    })
  })

  it('should GET pretty json document', function(done) {
    var opts = {
      url: process.env.FILES + '/' + id + '.json?pretty=1&force=1&fresh=1'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      assert(res);
      done(); 
    })
  })

  it('should GET html document', function(done) {
    var opts = {
      url: process.env.FILES + '/' + id + '.html?force=1&fresh=1'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      assert(res);
      done(); 
    })
  })

  it('should GET xml document', function(done) {
    var opts = {
      url: process.env.FILES + '/' + id + '.xml?force=1&fresh=1'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      assert(res);
      done(); 
    })
  })

  it('should GET jpg document', function(done) {
    var opts = {
      url: process.env.FILES + '/' + id + '.jpg?force=1&fresh=1'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      assert(res);
      done(); 
    })
  })

})
