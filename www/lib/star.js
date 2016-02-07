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
    $('nav.main').append(el);

    this.totals();
    this.init();

    if(opts.uri.pathname === '/stars') {
      this.list();
    }else{
      // only call fetch here on non /stars page
      // for /stars fetch will be called after rendering
      // the listing
      this.fetch();
    }
  }
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
  var scope = this;
  e.preventDefault();

  if(this.has(id)) {
    return false; 
  }

  function onResponse(err, res) {
    var doc;
    if(err) {
      return console.error(err); 
    }else if(res) {
      doc = JSON.parse(res); 
    }
    scope.write(id);
    scope.render(doc);
    scope.totals();
  }
  var opts = {
    url: this.opts.api + '/quote/' + id + '/star',
    method: 'POST',
    json: true
  };

  $.request(opts, onResponse.bind(this));
}

/**
 *  Render count totals in main navigation.
 */
function totals() {
  var len = this.count();
  if(len > 0) {
    var el = $('nav.main');
    el.find('a.stars span').remove();
    el.find('a.stars').append($.create('span'));
    el.find('a.stars span').addClass('star').text('' + len);
  }
}

/**
 *  Count the number of stars for this user.
 */
function count() {
  var ids = this.read();
  return ids.length;
}

/**
 *  Remove a star from the list of stars.
 */
function remove() {
  // TODO: remove a star from the storage
}

/**
 *  Read the array of ids from the local storage.
 */
function read() {
  var ids = localStorage.getItem(this.key);
  if(ids) {
    try {
      ids = JSON.parse(ids); 
    }catch(e) {
      ids = [];
    }
  }
  return ids || [];
}

/**
 *  Write an id to the local storage.
 */
function write(id) {
  var ids = this.read();
  if(!~ids.indexOf(id)) {
    ids.push(id); 
  }
  localStorage.removeItem(this.key);
  localStorage.setItem(this.key, JSON.stringify(ids));
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
  var scope = this;
  var ids = this.read();

  function onResponse(err, res) {
    var doc;
    if(err) {
      return console.error(err); 
    }else if(res) {
      doc = JSON.parse(res); 
    }
    scope.listing(doc);
    //render(doc);
    //console.log(doc);
  }

  if(!ids.length) {
    $('section.stars .help').css({display: 'block'});
  }else{
    var opts = {
      url: this.opts.api + '/quote',
      method: 'POST',
      json: true,
      body: ids
    };

    $.request(opts, onResponse.bind(this));
  }
}

/**
 *  Render the stars page listing.
 */
function listing(result) {
  var container = $('section.stars .listing');
  result.rows.forEach(function(item) {
    var doc = item.doc
      , el = $.partial('.quotation.item').clone(true);
    el.find('blockquote').text(doc.quote);
    el.find('cite').html('&#151; ' + doc.author);
    container.append(el);
  })
}

/**
 *  Render the star counters.
 */
function render(doc) {
  var ids = Object.keys(doc);
  ids.forEach(function(id) {
    var el = $('.quotation[data-id="' + id + '"]')
      , txt = el.find('a.star span');
    if(!txt.length) {
      el.find('a.star').append($.create('span'));
    }
    if(doc[id]) {
      el.find('a.star span').addClass('star').text('' + doc[id]);
    }
  })
}

/**
 *  Loads the star counters for all quotes.
 */
function fetch(ids) {
  var scope = this;
  if(!ids) {
    ids = [];
    this.quotes.each(function(el) {
      ids.push($(el).data('id'));
    })
  }

  // no elements on page
  if(!ids.length) {
    return; 
  }

  function onResponse(err, res) {
    var doc;
    if(err) {
      return console.error(err); 
    }else if(res) {
      doc = JSON.parse(res); 
    }
    scope.render(doc);
  }
  var opts = {
    url: this.opts.api + '/quote/star',
    method: 'POST',
    json: true,
    body: ids
  };

  $.request(opts, onResponse.bind(this));
}

[
  count, add, init, remove, list, totals, listing,
  read, write, has, fetch, render].forEach(function(m) {
  Star.prototype[m.name] = m;
});

module.exports = Star;
