process.env.FILES = process.env.FILES || '//file.spiritualisms.org';

var app = require('./file/server');
app.listen(3002);
