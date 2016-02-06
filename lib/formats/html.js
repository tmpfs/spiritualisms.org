var fs = require('fs')
  , styles = '' + fs.readFileSync(
    __dirname + '/../../www/public/assets/css/standalone.css');

/**
 *  Convert a quote to an HTML document.
 */
function format(info, req, res) {
  info.styles = styles;
  res.render('html', info);
}

module.exports = format;

