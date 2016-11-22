var $ = require('air')
  , Abstract = require('./abstract')
  , Import = require('./import');

/**
 *  Encapsulates the stars page functionality.
 */
function StarsPage(opts) {

  Abstract.apply(this, arguments);

  this.model = opts.model.star;
  this.isStarPage = document.location.pathname === '/stars';

  if(this.model.storage) {

    this.importer = new Import(opts);

    // keep in sync when storage changes
    $(window).on('storage', onStorage.bind(this));

    this.total();

    $('.actions .export').on('click', save.bind(this));
    $('.actions .clear').on('click', clear.bind(this));

    this.notifier.on('star/add', this.add.bind(this));
    this.notifier.on('star/remove', this.remove.bind(this));

    this.notifier.on('stars/list', this.list.bind(this));
    this.notifier.on('stars/total', this.total.bind(this));

    if(this.isStarPage) {
      $('header').find('a.stars').addClass('selected');
      this.list();
    }
  }
}

$.inherit(StarsPage, Abstract);

/**
 *  Listen for the storage event.
 *
 *  Fires in the other tabs/windows.
 */
function onStorage(e) {
  if(e.key === this.model.key) {
    this.total();
    if(this.isStarPage) {
      this.list(); 
    }else{
      this.notifier.emit('star/update');
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

  if(!this.model.length()) {
    return false;
  }

  function onResponse(/*err, res*/) {
    // NOTE: errors currently handled by model
    // NOTE: however follow idiomatic signature
    this.model.clear();

    // show initial message, remove listings etc.
    this.list();

    // update total display
    this.total();
  }

  function onDismiss(res) {
    if(res.accepted) {
      this.model.decr(this.model.read(), onResponse.bind(this));
    }
  }

  var opts = {
    el: $.partial('.dialog.clear-all')
  }

  $.dialog(opts, onDismiss.bind(this));

}

/**
 *  Add a star to the list of stars.
 */
function add(id, e) {
  e.preventDefault();

  if(this.model.has(id)) {
    return false;
  }

  var parent = $(e.currentTarget).parent();

  function onResponse(err, res) {
    // NOTE: errors currently handled by model
    // NOTE: however follow idiomatic signature
    this.model.add(id);

    this.total();

    // switch link to unstar view
    this.notifier.emit('star/toggle', id, true);

    // must render counter after toggle
    this.notifier.emit('star/render', res.body);

    // animate a little
    parent.find('i.star').flash();
    $('header .icon i.fa-star').flash();
  }

  this.model.incr([id], onResponse.bind(this));
}

/**
 *  Remove a star from the list of stars.
 */
function remove(id, e) {
  e.preventDefault();

  if(!this.model.has(id)) {
    return false; 
  }

  var parent = $(e.currentTarget).parent();

  function onResponse(err, res) {
    // NOTE: errors currently handled by model
    // NOTE: however follow idiomatic signature
    this.model.remove(id);

    this.total();

    // switch link to unstar view
    if(!this.isStarPage) {
      this.notifier.emit('star/toggle', id, false);
    }

    // must render counter after toggle
    this.notifier.emit('star/render', res.body);

    // animate a little
    parent.find('i.star').flash();
    $('header .icon i.fa-star').flash();

    var el = $('.quotation[data-id="' + id + '"]');
    function onFadeOut() {
      el.remove();
      if(!this.model.length()) {
        this.empty(); 
      }
    }

    if(this.isStarPage) {
      el.disable();
      el.fadeOut(onFadeOut.bind(this));
    }
  }

  this.model.decr([id], onResponse.bind(this));
}


/**
 *  Render count total in main navigation.
 */
function total() {
  var len = this.model.length()
    , el = $('header');

  if(len > 0) {
    el.find('a.stars span').remove();
    el.find('a.stars').append($.create('span'));
    el.find('a.stars span').addClass('star').text('' + len);
    //$('h2 sup').text(' ' + len);
  }else{
    el.find('a.stars span').remove();
    //$('h2 sup').text('');
  }
}

/**
 *  List stars.
 *
 *  Reads the list of identifiers and loads the documents from the 
 *  server.
 */
function list() {
  var ids = this.model.read().reverse();

  function onResponse(err, res) {
    // NOTE: errors currently handled by model
    // NOTE: however follow idiomatic signature
    this.listing(res.body);
  }

  // remove any listings
  $('.listing > *').remove();

  if(!ids.length) {
    this.empty();
  }else{
    $('.empty').css({display: 'none'});
    $('.actions .clear').enable();
    this.opts.model.quote.list(ids, onResponse.bind(this));
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
    cite.html('&#8212; ');
    cite.append(
        $.el('a',
          {href: doc.link, title: doc.author + ' (' + doc.domain + ')'})
            .text(doc.author)
    );
    el.find('nav.toolbar a').attr('href', '/explore/' + doc.id);
    container.append(el);
  })

  // update counters after render
  this.notifier.emit('love/update');
  this.notifier.emit('star/update');
}

[
  add, remove, list, total, listing, empty
].forEach(
  function(m) {
    StarsPage.prototype[m.name] = m;
  }
);

module.exports = StarsPage;
