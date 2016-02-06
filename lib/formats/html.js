/**
 *  Convert a quote to an HTML document.
 */
function format(info, req, res) {
  res.render('html', info);
}

module.exports = format;

