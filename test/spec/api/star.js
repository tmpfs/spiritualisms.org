var expect = require('chai').expect
  , request = require('request');

describe('api:', function() {
  var quotes
    , amount;

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

  it('should POST to increment number of stars', function(done) {
    var opts = {
      url: process.env.API + '/quote/' + quotes.rows[0].id + '/star',
      method: 'POST',
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

  it('should POST to increment multiple stars', function(done) {
    var opts = {
      url: process.env.API + '/quote/star',
      method: 'POST',
      json: true,
      body: [quotes.rows[0].id, quotes.rows[1].id]
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      var body = res.body;
      expect(body).to.be.an('object')
      expect(Object.keys(body)).to.be.an('array')
        .to.have.length.gt(0);
      expect(body[Object.keys(body)[0]]).to.be.a('number');
      expect(body[Object.keys(body)[1]]).to.be.a('number');
      done(); 
    })
  })

  it('should GET number of stars', function(done) {
    var opts = {
      url: process.env.API + '/quote/' + quotes.rows[0].id + '/star',
      json: true
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      var body = res.body;
      expect(body).to.be.an('object')
      expect(Object.keys(body)).to.be.an('array')
        .to.have.length.gt(0);
      amount = body[Object.keys(body)[0]];
      expect(amount).to.be.a('number');
      done(); 
    })
  })

  it('should DELETE to decrement number of stars', function(done) {
    var opts = {
      url: process.env.API + '/quote/' + quotes.rows[0].id + '/star',
      method: 'DELETE',
      json: true
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      var body = res.body;
      expect(body).to.be.an('object')
      expect(Object.keys(body)).to.be.an('array')
        .to.have.length.gt(0);
      expect(body[Object.keys(body)[0]]).to.be.a('number')
        .to.eql(amount - 1);
      done(); 
    })
  })

  it('should DELETE to decrement multiple stars', function(done) {
    var opts = {
      url: process.env.API + '/quote/star',
      method: 'DELETE',
      json: true,
      body: [quotes.rows[2].id, quotes.rows[3].id, 'foo']
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      var body = res.body;
      expect(body).to.be.an('object')
      expect(Object.keys(body)).to.be.an('array')
        .to.have.length.gt(0);
      expect(body[Object.keys(body)[0]]).to.be.a('number');

      // should have ignored missing document
      expect(Object.keys(body).length).to.be.lt(opts.body.length);

      done(); 
    })
  })

  it('should POST for star map', function(done) {
    var ids = [];
    quotes.rows.forEach(function(row) {
      ids.push(row.id); 
    })
    var opts = {
      url: process.env.API + '/quote/star',
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
