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
    api: process.env.API || 'http://localhost:3001'
  }
  o.env = env;
  return o;
}

module.exports = getViewInfo;
