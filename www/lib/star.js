var $ = require('air')
  , StarModel = require('./model/star');

/**
 *  Encapsulates the star functionality.
 */
function Star(opts) {
  this.opts = opts;
  this.model = new StarModel();

  if(this.model.storage) {

    // inject stars link to main navigation
    var nav = $('nav.main');
    var el = $.el('a')
      .attr({href: '/stars', title: 'Stars'})
      .addClass('stars')
      .html('&nbsp;Stars');
    el.prepend($.el('i').addClass('fa fa-star'));
    nav.append(el);

    this.totals();

    $('.actions .export').on('click', save.bind(this));
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

/**
 *  Saves the array of identifiers as a JSON document.
 */
function save(e) {
  e.preventDefault();
  this.model.save();
}

/**
 *  Removes all stars from the local storage.
 */
function clear(e) {
  e.preventDefault();

  this.model.clear();

  // show initial message, remove listings etc.
  this.list();

  // update totals display
  this.totals();
}

/**
 *  Initializes the star links on a page.
 */
function init() {
  this.quotes = $('.quotation[data-id]');
  function it(el) {
    var id = $(el).data('id')
    this.toggle(id, this.model.has(id));
  }
  this.quotes.each(it.bind(this));
}

/**
 *  Toggle a star link view.
 */
function toggle(id, unstar) {
  var add = this.add.bind(this, id)
    , remove = this.remove.bind(this, id)
    , el = $('.quotation[data-id="' + id + '"]')
    , link = el.find('a.star');

  if(unstar) {
    $.swap(link, $.partial('a.unstar'));
  }else{
    $.swap(link, $.partial('a.star'));
  }

  // rewrote the DOM get the new reference
  link = el.find('a.star');
  // update listener
  link.on('click', unstar ? remove : add);
  // keep href in sync
  link.attr({href: '/explore/' + id});
}

/**
 *  Add a star to the list of stars.
 */
function add(id, e) {
  e.preventDefault();

  if(this.model.has(id)) {
    return false;
  }

  function onResponse(err, res) {
    if(err) {
      return console.error(err); 
    }
    this.model.add(id);
    this.render(res.body);
    // switch link to unstar view
    this.toggle(id, true);
    this.totals();
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
  var len = this.model.length()
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
 *  Remove a star from the list of stars.
 */
function remove(id, e) {
  e.preventDefault();

  // TODO: remove a star from the storage
  console.log('remove: ' + id);

  if(!this.model.has(id)) {
    return false; 
  }

  this.model.del(id);

  //var o = {};
  //o[id] = 
  //this.render(o);
  this.totals();

  // switch to the star view
  this.toggle(id, false);
}

/**
 *  List stars.
 *
 *  Reads the list of identifiers and loads the documents from the 
 *  server.
 */
function list() {
  var ids = this.model.read();

  function onResponse(err, res) {
    if(err) {
      return console.error(err); 
    }
    this.listing(res.body);
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
      , txt = el.find('a.star span')
      , count = doc[id];

    el.data('stars', count);

    if(!txt.length) {
      el.find('a.star').append($.create('span'));
    }
    if(doc[id]) {
      el.find('a.star span').addClass('star').text('' + count);
    }

    el.attr({href: '/explore/' + id})
  })
}

/**
 *  Loads the star counters for all quotes.
 */
function fetch(ids) {
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
    if(err) {
      return console.error(err); 
    }
    this.render(res.body);
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
  add, init, remove, list, totals, listing, toggle, fetch, render
].forEach(
  function(m) {
    Star.prototype[m.name] = m;
  }
);

module.exports = Star;
