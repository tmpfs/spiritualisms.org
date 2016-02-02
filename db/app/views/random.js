/* jshint ignore:start */
module.exports = {
  map: function(doc) {
    if(doc.type === 'quote' && doc.publish === true) {
      emit(doc.random, null);
    }
  },
  reduce: '_count'
}
/* jshint ignore:end */
