var exec = require('child_process').exec
  , path = require('path')
  , util = require('util')
  , fs = require('fs')
  , tempfile = require('tempfile')
  , cmd = 'wkhtmltoimage';

/**
 *  Convert a quote to a JPG document.
 *
 *  Loads the html download page and converts it to a jpg using
 *  wkhtmltoimage(1) which ensures we get all the fonts in the resulting 
 *  image.
 *
 *  We then load the file into memory and remove the temporary file.
 */
function jpg(info, cb) {
  var name = path.basename(info.filename, '.jpg')
    , output = tempfile('.jpg');

  var domain = process.env.FILES;

  // if we are using the protocol-less '//' reference strip it
  // so that wkhtmltoimage will use plain HTTP correctly
  domain = domain.replace(/^\/\//,'');

  var command = util.format(
    '%s %s %s',
    cmd,
    domain + '/' + name + '.html',
    output);

  exec(command, function(err) {
    if(err) {
      return cb(err);
    }
    var buf = fs.readFileSync(output);
    fs.unlinkSync(output);
    cb(null, buf);
  });
}

module.exports = jpg;
