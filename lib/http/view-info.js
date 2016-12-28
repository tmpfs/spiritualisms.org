var url = require('url')
  , env = require('nenv')();

/**
 *  Helper function to get default view information.
 */
function getViewInfo(req) {
  var o = {}
    , uri = url.parse(req.url);

  o.url = req.url;
  o.uri = uri;
  /* istanbul ignore next: always set API in test env */
  o.app = {
    www: process.env.WWW || '//www.spiritualisms.org',
    api: process.env.API || '//api.spiritualisms.org',
    files: process.env.FILES || '//file.spiritualisms.org'
  }
  o.env = env.current;
  return o;
}

module.exports = getViewInfo;
