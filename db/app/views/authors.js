/* jshint ignore:start */
module.exports = {
  map: function(doc) {
    if(doc.type === 'quote'
      && doc.publish === true
      && doc.author) {
      emit(doc.author, 1); 
    }
  },
  reduce: function(keys, values) {
    return sum(values); 
  }
}
/* jshint ignore:end */
