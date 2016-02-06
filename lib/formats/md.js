var util = require('util');

/**
 *  Convert a quote to a markdown document.
 *
 *  @see http://talk.commonmark.org/t/ \
 *    ietf-request-for-input-text-markdown-media-type/700
 *
 *  @see http://stackoverflow.com/questions/10701983/ \
 *    what-is-the-mime-type-for-markdown
 */
function format(info, req, res) {
  var doc = info.doc
    , link = util.format('[%s](%s)', doc.author, doc.link)
    , md = util.format('> %s\n--%s', doc.quote, link);

  // assuming IETF ratifies text/markdown for the moment
  res.set('content-type', 'text/markdown');

  res.send(md);
}

module.exports = format;
