process.env.FILES = process.env.FILES || '//file.spiritualisms.org';

// shouldn't need nginx proxy in devel
var env = require('nenv')();
if(env.devel) {
  process.env.FILES = 'http://localhost:3002'; 
}

var app = require('./server');
app.listen(3002);
