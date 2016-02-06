/**
 *  Convert a quote to a JSON document.
 */
function format(info, req, res) {
  res.set('content-type', 'application/json');
  res.send(info.doc);  
}

module.exports = format;
