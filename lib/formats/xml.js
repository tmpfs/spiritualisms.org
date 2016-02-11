var xml = require('../util/xml')
  , escapeXml = xml.escapeXml
  , tag = xml.tag;

/**
 *  Convert a quote to an XML document.
 */
function format(info, req, res) {
  res.set('content-type', 'text/xml');

  var decl = '<?xml version="1.0" encoding="UTF-8"?>'
    , newline = '\n'
    , root = 'document'
    , quote = 'quote'
    , content = 'content'
    , author = 'author'
    , tags
    , xml = decl + newline
    , attrs = [];

  //<!DOCTYPE Spiritualism SYSTEM "spiritualisms.dtd">

  attrs.push(['xmlns', 'http://spiritualisms.org/xml/1.0']);
  xml += tag(root, attrs);

  // quote body
  attrs = [];
  attrs.push(['id', info.doc.id]);
  attrs.push(['created', info.doc.created]);
  xml += tag(quote, attrs);

  xml += tag(content);
  xml += escapeXml(info.doc.quote);
  xml += tag(content, true);

  // quote author
  attrs = [];
  attrs.push(['link', info.doc.link]);
  attrs.push(['domain', info.doc.domain]);
  xml += tag(author, attrs);
  xml += escapeXml(info.doc.author);
  xml += tag(author, true);

  tags = info.doc.tags || [];
  xml += tag('tags');
  tags.rows.forEach(function(o) {
    xml += tag('tag'); 
    xml += escapeXml(o.key);
    xml += tag('tag', true); 
  })
  xml += tag('tags', true);

  xml += tag(quote, true);
  xml += tag(root, true);

  res.send(xml);
}

module.exports = format;
