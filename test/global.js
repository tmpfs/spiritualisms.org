var www = require('../www/server');
process.env.WWW = process.env.WWW || 'http://localhost:3000';

before(function(done) {
  www.listen(3000);
  done();
})
