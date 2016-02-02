/* jshint ignore:start */
module.exports = {
  map: function(doc) {
    if(doc.type === 'quote' && doc.publish === true) {
      emit(doc._id, null);
    }
  },
  reduce: '_count'
}
/* jshint ignore:end */
