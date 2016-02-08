var $ = require('air');

function dismiss() {
  $('[href="#dismiss"]').on('click', function(e) {
    e.preventDefault();
    var p = $(e.currentTarget).parent(); 
    p.fadeOut(function() {
      p.remove(); 
    })
  })
}

module.exports = dismiss;
