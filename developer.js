/**
 * Require Browsersync
 */
var browserSync = require('browser-sync');

/**
 * Run Browsersync with server config
 */
browserSync({
  //port: 4000,
  //ui: {
    //port: 4001
  //},
  files: ["www/public/assets/js/*.js", "www/public/assets/css/*.css"]
});
