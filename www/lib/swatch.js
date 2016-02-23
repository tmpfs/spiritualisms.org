var $ = require('air')
  , Abstract = require('./abstract');

/**
 *  Encapsulates the color swatches for the browser home page.
 */
function Swatch() {
  Abstract.apply(this, arguments);
  this.current = null;
  this.storage = localStorage;
  this.key = 'bodyClass';

  if(this.storage) {

    // keep in sync when storage changes
    $(window).on('storage', onStorage.bind(this));

    this.state = setState.bind(this);

    $('.swatches a').on('click', click.bind(this));
    if(this.storage[this.key]) {
      this.state(this.storage[this.key]);
    }

  }
}

$.inherit(Swatch, Abstract);

/**
 *  Handle a swatch click.
 */
function click(e) {
  e.preventDefault();
  var el = $(e.currentTarget)
    , id = el.find('svg').attr('class');
  this.state(id);
}

/**
 *  Set the current state.
 */
function setState(id) {
  var body = $('body')
    , el = $('.swatches a[href="#' + id + '"]');

  if(body.hasClass(id)) {
    return false; 
  }

  if(this.current) {
    body.removeClass(this.current); 
  }

  body.addClass(id);

  $('.swatches a').removeClass('selected');
  el.addClass('selected');

  this.storage[this.key] = id;
  this.current = id;
}

/**
 *  Listen for the storage event.
 *
 *  Fires in the other tabs/windows.
 */
function onStorage(e) {
  if(e.key === this.key) {
    this.state(this.storage[this.key]);
  }
}

module.exports = Swatch;
