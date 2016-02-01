var www = require('../www/server')
  , api = require('../api/server');
process.env.WWW = process.env.WWW || 'http://localhost:4000';
process.env.API = process.env.API || 'http://localhost:4001';

before(function(done) {
  www.listen(4000);
  api.listen(4001);
  done();
})
