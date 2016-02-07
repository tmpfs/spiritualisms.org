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
      expect(body).to.be.an('object')
      expect(Object.keys(body)).to.be.an('array')
        .to.have.length.gt(0);
      expect(body[Object.keys(body)[0]]).to.be.a('number');
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
    //console.log(ids)
    var opts = {
      url: process.env.API + '/quote/love',
      method: 'POST',
      headers: {
        'content-type': 'application/json' 
      },
      body: JSON.stringify(ids)
    }
    request(opts, function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      var body = JSON.parse(res.body);
      expect(body).to.be.an('object')
      expect(Object.keys(body)).to.be.an('array')
        .to.have.length.gt(0);
      expect(body[Object.keys(body)[0]]).to.be.a('number');
      done(); 
    })
  })

})
