module.exports = function(newDoc, oldDoc, userCtx, secObj) {
  if(!newDoc.random) {
    newDoc.random = Math.random(); 
  }
}
