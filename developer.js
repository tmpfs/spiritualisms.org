process.env.NODE_ENV='devel';

// start the web server
require('./server');

// start the api server
require('./api-server');

// browsersync
var bs = require('browser-sync').create();

bs.init({
  port: 5000,
  ui: {
    port: 5001
  },
  ghostMode: false,
  logLevel: 'silent',
  files: ['./www/public/assets/js/*.js', './www/public/assets/css/*.css']
});
