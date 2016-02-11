/* jshint ignore:start */
module.exports = {
  map: function(doc) {
    if(doc.type === 'quote'
      && doc.publish === true
      && Array.isArray(doc.tags)) {
      doc.tags.forEach(function(tag){
        emit((tag || '').toLowerCase(), 1); 
      })
    }
  },
  reduce: function(keys, values) {
    return sum(values); 
  }
}
/* jshint ignore:end */
