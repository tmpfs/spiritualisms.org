var util = require('util');

/**
 *  Convert a quote to a text document.
 */
function format(info, req, res) {
  var doc = info.doc
    , link = util.format('[1]: %s', doc.link)
    , txt = util.format('%s\n\n--%s', doc.quote, doc.author + '[1]')
        + '\n\n' + link;
  res.set('content-type', 'text/plain');
  res.send(txt);
}

module.exports = format;
