process.env.FILES = process.env.FILES || 'http://localhost:3002';

var app = require('./file/server');
app.listen(3002);
