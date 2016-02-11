/**
 *  When a request with a trailing slash is found, redirect 
 *  without the trailing slash.
 */
function slashes(req, res, next) {
  if(req.url.substr(-1) === '/' && req.url.length > 1) {
    res.redirect(301, req.url.slice(0, -1));
  }else{
    next();
  }
}

module.exports = slashes;
