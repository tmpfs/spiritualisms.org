var $ = require('air')
  , StarModel = require('./model/star');

/**
 *  Encapsulates the star functionality.
 */
function Star(opts) {

  this.opts = opts;
  this.model = new StarModel(opts);
  this.isStarPage = document.location.pathname === '/stars';

  if(this.model.storage) {

    // keep in sync when storage changes
    $(window).on('storage', onStorage.bind(this));

    // inject stars link to main navigation
    var nav = $('nav.main');
    var el = $.el('a')
      .attr({href: '/stars', title: 'Stars'})
      .addClass('stars')
      .html('&nbsp;Stars');
    el.prepend($.el('i').addClass('fa fa-star'));
    nav.append(el);

    var chooser = $('#import');

    if(!window.FileList || !window.FileReader) {
      $('a.import').remove();
      chooser.remove(); 
    }else{
      chooser.on('change', load.bind(this));
    }

    this.totals();

    $('.actions .export').on('click', save.bind(this));
    $('.actions .clear').on('click', clear.bind(this));

    if(this.isStarPage) {
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
 *  Listen for the storage event.
 *
 *  Fires in the other tabs/windows.
 */
function onStorage(e) {
  if(e.key === this.model.testKey) {
    return false; 
  }

  this.totals();
  if(this.isStarPage) {
    this.list(); 
  }else{
    this.init();
    this.fetch();
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
 *  Load a JSON document and import into the local storage.
 */
function load(e) {
  e.preventDefault();
  var files = e.target.files
    , file = files[0];
  var reader = new FileReader();
  reader.onload = function() {
    var doc;
    try {
      doc = JSON.parse(this.result); 
    }catch(e) {
      // TODO: show message to the user
      return console.error(e); 
    }
    console.log(doc);
  }
  reader.readAsText(file);
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
    // NOTE: errors currently handled by model
    // NOTE: however follow idiomatic signature
    this.model.add(id);
    // switch link to unstar view
    this.toggle(id, true);
    this.totals();

    // must render counter after toggle
    this.render(res.body);
  }

  this.model.incr(id, onResponse.bind(this));
}

/**
 *  Remove a star from the list of stars.
 */
function remove(id, e) {
  e.preventDefault();

  if(!this.model.has(id)) {
    return false; 
  }

  function onResponse(err, res) {
    // NOTE: errors currently handled by model
    // NOTE: however follow idiomatic signature
    this.model.remove(id);
    // switch to the star view
    this.toggle(id, false);
    this.totals();
    // must render counter after toggle
    this.render(res.body);

    if(this.isStarPage) {
      var el = $('.quotation[data-id="' + id + '"]');
      el.remove();
      if(!this.model.length()) {
        this.empty(); 
      }
    }
  }

  this.model.decr(id, onResponse.bind(this));
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
 *  List stars.
 *
 *  Reads the list of identifiers and loads the documents from the 
 *  server.
 */
function list() {
  var ids = this.model.read();

  function onResponse(err, res) {
    // NOTE: errors currently handled by model
    // NOTE: however follow idiomatic signature
    this.listing(res.body);
  }

  // remove any listings
  $('.listing > *').remove();

  //console.log('list: ' + ids);

  if(!ids.length) {
    this.empty();
  }else{
    $('.empty').css({display: 'none'});
    $('.actions .clear').enable();
    this.model.list(ids, onResponse.bind(this));
  }
}

/**
 *  Show the empty listing view.
 */
function empty() {
  $('.empty').css({display: 'block'});
  $('.actions .export').disable();
  $('.actions .clear').disable();
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
    // NOTE: errors currently handled by model
    // NOTE: however follow idiomatic signature
    this.render(res.body);
  }

  this.model.count(ids, onResponse.bind(this));
}

[
  add, init, remove, list, totals, listing, toggle, fetch, render, empty
].forEach(
  function(m) {
    Star.prototype[m.name] = m;
  }
);

module.exports = Star;
