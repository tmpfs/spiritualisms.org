/**
 *  Generic model api response handler.
 */
function onResponse(cb, err, res) {
  if(err) {
    return console.error(err); 
  }
  cb(null, res);
}

module.exports = onResponse;
