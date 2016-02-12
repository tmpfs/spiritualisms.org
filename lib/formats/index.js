var list = ['md', 'txt', 'pdf', 'html', 'json', 'xml']
  , map = {}
  , mime = {
    // assuming IETF ratifies text/markdown for the moment
    md: 'text/markdown',
    txt: 'text/plain',
    pdf: 'application/pdf',
    html: 'text/html',
    json: 'application/json',
    xml: 'text/xml'
  }

list.forEach(function(ext) {
  map[ext] = require('./' + ext);
})

var info = {
  list: list,
  map: map,
  mime: mime
}

// constants
list.forEach(function(ext) {
  info[ext.toUpperCase()] = ext;
});

module.exports = info;
