var getViewInfo = require('./view-info');

/**
 *  Error handler for services that render an HTML view for 
 *  errors.
 */
function error(err, req, res, next) {
  var info = getViewInfo(req);
  /* istanbul ignore next: assume internal server error */
  info.status = err.status || 500;
  info.message = err.message || err.reason;
  info.doc = err.doc;
  info.res = err.res;
  info.stack = err.stack;
  res.status(info.status).render('error', info);
  next();
}

module.exports = error;
