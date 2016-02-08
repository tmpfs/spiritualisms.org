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
    var nav = $('nav.main');
    var el = $.el('a')
      .attr({href: '/stars', title: 'Stars'})
      .addClass('stars')
      .html('&nbsp;Stars');
    el.prepend($.el('i').addClass('fa fa-star'));
    nav.append(el);

    this.totals();

    $('.actions .export').on('click', exporter.bind(this));
    $('.actions .clear').on('click', clear.bind(this));

    if(opts.uri.pathname === '/stars') {
      nav.find('a.stars').addClass('selected');
      this.list();
    }else{
      // only call fetch here on non /stars page
      // for /stars fetch will be called after rendering
      // the listing
      this.init();
      this.fetch();
    }
  }
}

function exporter(e) {
  e.preventDefault();
  var blob = new Blob(
    [JSON.stringify(this.read(), undefined, 2)], {type: 'application/json'})
    , file = 'stars.json';
  // requires file-saver.js to be loaded
  window.saveAs(blob, file, true);
}

function clear(e) {
  e.preventDefault();

  // remove storage
  localStorage.removeItem(this.key);

  // show initial message, remove listings etc.
  this.list();

  // update totals display
  this.totals();
}

function init() {
  var scope = this;
  this.quotes = $('.quotation[data-id]');
  this.quotes.each(function(el) {
    el = $(el);
    var id = el.data('id')
      , add = scope.add.bind(scope, id)
      , remove = scope.remove.bind(scope, id)
      , link = el.find('a.star');
    if(scope.has(id)) {
      $.swap('.quotation[data-id="' + id + '"] a.star', $.partial('a.unstar'));
      el.find('a.unstar').on('click', remove);
    }else{
      link.on('click', add);
    }
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
  var len = this.count()
    , el = $('nav.main');
  if(len > 0) {
    el.find('a.stars span').remove();
    el.find('a.stars').append($.create('span'));
    el.find('a.stars span').addClass('star').text('' + len);
  }else{
    el.find('a.stars span').remove();
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
function remove(id, e) {
  e.preventDefault();
  // TODO: remove a star from the storage
  console.log('remove: ' + id);
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
  }

  if(!ids.length) {
    $('.empty').css({display: 'block'});
    $('.actions .export').addClass('disabled');
    $('.actions .clear').addClass('disabled');

    // remove any listings
    $('.listing > *').remove();

  }else{
    $('.actions .clear').removeClass('disabled');

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
      , el = $.partial('.quotation.item').clone(true).data('id', doc.id);
    el.find('blockquote').text(doc.quote);
    var cite = el.find('cite');
    cite.html('&#151; ');
    cite.append(
        $.el('a',
          {href: doc.link, title: doc.author + ' (' + doc.domain + ')'})
            .text(doc.author)
    );
    el.find('nav.toolbar a').attr('href', '/explore/' + doc.id);
    container.append(el);
  })

  // update counters after render
  this.init();
  this.fetch();
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
