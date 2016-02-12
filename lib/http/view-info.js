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
    www: process.env.WWW || 'http://localhost:3000',
    api: process.env.API || 'http://localhost:3001',
    files: process.env.FILES || 'http://localhost:3002'
  }
  o.env = env;
  return o;
}

module.exports = getViewInfo;
