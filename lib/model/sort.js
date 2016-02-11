/**
 *  Sort a tag or author list.
 */
function sort(rows) {
  return rows.sort(function(a, b) {
    if(a.key === b.key) {
      return 0; 
    }
    return (a.key > b.key) ? 1 : -1;
  })
}

module.exports = sort;
