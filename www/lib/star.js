var $ = require('air');

/**
 *  Utility to determine if localStorage or sessionStorage 
 *  is supported.
 */
function storageAvailable(type) {
	try {
		var storage = window[type],
			x = '__storage_test__';
		storage.setItem(x, x);
		storage.removeItem(x);
		return true;
	}catch(e) {
		return false;
	}
}

function Star(opts) {
  this.opts = opts;
  if(storageAvailable('localStorage')) {
    var el = $.el('a')
      .attr({href: '/stars', title: 'Stars'})
      .addClass('stars')
      .html('&nbsp;Stars');
    el.prepend($.el('i').addClass('fa fa-star'));
    $('nav.main').prepend(el);
  }
}

module.exports = Star;
