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
		return storage;
	}catch(e) {
		return false;
	}
}

function Star(opts) {
  this.opts = opts;
  this.storage = storageAvailable('localStorage');
  this.key = 'stars';
  if(this.storage) {
    var el = $.el('a')
      .attr({href: '/stars', title: 'Stars'})
      .addClass('stars')
      .html('&nbsp;Stars');
    el.prepend($.el('i').addClass('fa fa-star'));
    $('nav.main').prepend(el);
  }
  this.init();
  this.list();
}

function init() {
  var scope = this;
  this.quotes = $('.quotation[data-id]');
  this.quotes.each(function(el) {
    el = $(el);
    var id = el.data('id');
    var add = scope.add.bind(scope, id);
    el.find('a.star').on('click', add);
  })
}

/**
 *  Add a star to the list of stars.
 */
function add(id, e) {
  e.preventDefault();
  console.log(id);
}

/**
 *  Remove a star from the list of stars.
 */
function remove() {
  // TODO: remove a star from the storage
}

/**
 *  Parse the array of ids from the local storage.
 */
function read() {
  var ids = localStorage[this.key] || [];
  if(ids) {
    try {
      ids = JSON.parse(ids); 
    }catch(e) {
      ids = [];
    }
  }
  return ids;
}

/**
 *  Determine if a star already exists.
 */
function has(id) {
  var ids = this.read();
  return Boolean(~ids.indexOf(id));
}

/**
 *  List stars.
 *
 *  Reads the list of identifiers and loads the documents from the 
 *  server.
 */
function list() {
  var ids = this.read();
  if(!ids.length) {
    $('section.stars .help').css({display: 'block'});
  }else{
    // TODO: list stars
  }
}

[add, init, remove, list, read, has].forEach(function(m) {
  Star.prototype[m.name] = m;
});

module.exports = Star;
