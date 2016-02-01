module.exports = {
  map: function(doc) {
    if(doc.type === 'quote') {
      emit(doc.random, null);
    }
  },
  reduce: '_count'
}
