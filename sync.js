process.env.NODE_ENV = process.env.NODE_ENV || 'devel';

// start the web server
require('./server');

// start the api server
require('./api-server');

// browsersync
var bs = require('browser-sync').create()
  , chokidar = require('chokidar')
  , exec = require('child_process').execSync;

bs.init({
  port: 5000,
  ui: {
    port: 5001
  },
  ghostMode: false,
  notify: false,
  logLevel: 'silent',
  files: ['./www/public/assets/js/*.js', './www/public/assets/css/*.css']
});

// js files
chokidar.watch('www/lib', {ignored: /[\/\\]\./})
  .on('change', function() {
    exec('npm run compile'); 
  });

// css files
chokidar.watch('www/css', {ignored: /[\/\\]\./})
  .on('change', function() {
    exec('npm run css'); 
  });
