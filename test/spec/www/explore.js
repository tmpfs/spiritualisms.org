var expect = require('chai').expect
  , request = require('request')
  , Quote = require('../../../lib/model/quote');

describe('www:', function() {
  var quotes;

  before(function(done) {
    var quote = new Quote();
    quote.list({}, function(err, res, body) {
      quotes = body.rows;
      done();
    })
  })

  it('should GET explore list page', function(done) {
    var opts = {
      url: process.env.WWW + '/explore'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      done(); 
    })
  })

  it('should GET explore quote page', function(done) {
    var opts = {
      url: process.env.WWW + '/explore/' +  quotes[0].id
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      done(); 
    })
  })

  it('should GET explore quote format page (.md)', function(done) {
    var opts = {
      url: process.env.WWW + '/explore/' +  quotes[0].id + '.md'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      expect(res.headers['content-type'])
        .to.eql('text/markdown; charset=utf-8');
      done(); 
    })
  })

  it('should GET explore quote format page (.pdf)', function(done) {
    var opts = {
      url: process.env.WWW + '/explore/' +  quotes[0].id + '.pdf'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      expect(res.headers['content-type'])
        .to.eql('application/pdf');
      done(); 
    })
  })

  it('should GET explore quote format page (.html)', function(done) {
    var opts = {
      url: process.env.WWW + '/explore/' +  quotes[0].id + '.html'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      expect(res.headers['content-type'])
        .to.eql('text/html; charset=utf-8');
      done(); 
    })
  })

  it('should GET explore quote format page (.json)', function(done) {
    var opts = {
      url: process.env.WWW + '/explore/' +  quotes[0].id + '.json'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      expect(res.headers['content-type'])
        .to.eql('application/json; charset=utf-8');
      done(); 
    })
  })

  it('should GET explore quote format page (.xml)', function(done) {
    var opts = {
      url: process.env.WWW + '/explore/' +  quotes[0].id + '.xml'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      expect(res.headers['content-type'])
        .to.eql('text/xml; charset=utf-8');
      done(); 
    })
  })

  it('should GET explore quote format page (.txt)', function(done) {
    var opts = {
      url: process.env.WWW + '/explore/' +  quotes[0].id + '.txt'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      expect(res.headers['content-type'])
        .to.eql('text/plain; charset=utf-8');
      done(); 
    })
  })

  it('should GET 404 on missing quote page', function(done) {
    var opts = {
      url: process.env.WWW + '/explore/non-existent'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(404);
      done(); 
    })
  })

  // tags
  it('should GET tags page', function(done) {
    var opts = {
      url: process.env.WWW + '/explore/tags'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      done(); 
    })
  })

  it('should GET tags search results', function(done) {
    var opts = {
      url: process.env.WWW + '/explore/tags?q=love'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      done(); 
    })
  })

  it('should GET tag page (love)', function(done) {
    var opts = {
      url: process.env.WWW + '/explore/tags/love'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      done(); 
    })
  })

  // authors
  it('should GET authors page', function(done) {
    var opts = {
      url: process.env.WWW + '/explore/authors'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      done(); 
    })
  })

  it('should GET authors search results', function(done) {
    var opts = {
      url: process.env.WWW + '/explore/authors?q=rumi'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      done(); 
    })
  })

  it('should GET author page (rumi)', function(done) {
    var opts = {
      url: process.env.WWW + '/explore/authors/rumi'
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      done(); 
    })
  })

})
