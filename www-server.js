process.env.WWW = process.env.WWW || '//www.spiritualisms.org';

// shouldn't need nginx proxy in devel
var env = require('nenv')();
if(env.devel) {
  process.env.WWW = 'http://localhost:3000';
}

var app = require('./www/server');
app.listen(3000);
