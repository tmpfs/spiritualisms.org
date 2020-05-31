var env = require('nenv')();
if(!env.defined) {
  env.set(env.DEVEL);
}

// start the web server
require('./www-server');

// start the api server
require('./api-server');

// start the file server
require('./file-server');

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
    if(env.production) {
      exec('npm run minify'); 
    }else{
      exec('npm run compile'); 
    }
  });

// css files
chokidar.watch('www/css', {ignored: /[\/\\]\./})
  .on('change', function() {
    if(env.production) {
      exec('npm run minify-css');
    }else{
      exec('npm run css'); 
    }
  });
