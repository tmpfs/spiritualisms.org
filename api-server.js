process.env.API = process.env.API || '//api.spiritualisms.org';

// shouldn't need nginx proxy in devel
var env = require('nenv')();
if(env.devel) {
  process.env.API = 'http://localhost:3001';
}

var app = require('./api/server');
app.listen(3001);
