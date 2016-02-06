/**
 *  Utilities borrowed from commonmark.js.
 */

var ENTITY = "&(?:#x[a-f0-9]{1,8}|#[0-9]{1,8}|[a-z][a-z0-9]{1,31});";
var XMLSPECIAL = '[&<>"]';
var reXmlSpecial = new RegExp(XMLSPECIAL, 'g');
var reXmlSpecialOrEntity = new RegExp(ENTITY + '|' + XMLSPECIAL, 'gi');

function replaceUnsafeChar(s) {
    switch (s) {
    case '&':
        return '&amp;';
    case '<':
        return '&lt;';
    case '>':
        return '&gt;';
    case '"':
        return '&quot;';
    default:
        return s;
    }
}

function escapeXml(s, preserve_entities) {
  if(reXmlSpecial.test(s)) {
    if(preserve_entities) {
      return s.replace(reXmlSpecialOrEntity, replaceUnsafeChar);
    }else{
      return s.replace(reXmlSpecial, replaceUnsafeChar);
    }
  }else{
    return s;
  }
}

/**
 *  Helper to render an XML tag.
 */
function tag(name, attrs) {
  // close tag
  if(attrs === true) {
    return '</' + name + '>';
  }

  var result = '<' + name;
  if(attrs && attrs.length > 0) {
    var i = 0;
    var attrib;
    while ((attrib = attrs[i]) !== undefined) {
      result += ' ' + attrib[0] + '="' + attrib[1] + '"';
      i++;
    }
  }
  result += '>';
  return result;
}

module.exports ={
  tag: tag,
  escapeXml: escapeXml
}
