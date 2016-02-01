module.exports = {
  map: function(doc) {
    if(doc.type === 'quote') {
      emit(doc._id, null);
    }
  },
  reduce: '_count'
}
