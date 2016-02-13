process.env.WWW = process.env.WWW || 'http://localhost:4000';
process.env.API = process.env.API || 'http://localhost:4001';
process.env.FILES = process.env.FILES || 'http://localhost:4002';

var www = require('../www/server')
  , api = require('../api/server')
  , files = require('../file/server');

before(function(done) {
  www.listen(4000, function(err) {
    if(err) {
      done(err);
    }
    api.listen(4001, function(err) {
      if(err) {
        done(err);
      }
      files.listen(4002, function(err) {
        if(err) {
          done(err);
        }
        done();
      });
    });
  });
})
