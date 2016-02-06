var list = ['md', 'txt', 'pdf', 'html', 'json', 'xml']
  , map = {};

list.forEach(function(ext) {
  map[ext] = require('./' + ext);
})

module.exports = {
  list: list,
  map: map
}
