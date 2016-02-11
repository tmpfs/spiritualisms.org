/**
 *  Adds CORS headers to http responses.
 *
 *  @param req The incoming http request.
 *  @param res The outgoing http response.
 */
function cors(req, res) {
  var requested = req.headers['access-control-request-headers'] || []
    , methods = ['GET', 'POST', 'DELETE', 'PUT'];
  if(typeof(requested) === 'string') {
    requested = requested.split(/, ?/);
  }
  var expose = ['Date', 'Content-type', 'Content-Length', 'ETag'];
  res.set('Access-Control-Allow-Origin', "*");
  res.set('Access-Control-Allow-Headers', requested.join(', '));
  res.set('Access-Control-Expose-Headers', expose.join(', '))
  res.set('Access-Control-Allow-Methods', methods.join(', '));
  res.set('Access-Control-Max-Age', 300);
}

module.exports = cors;
