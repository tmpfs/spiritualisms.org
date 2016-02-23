var $ = require('air')
  , Abstract = require('./abstract');

/**
 *  Encapsulates the color swatches for the browser home page.
 */
function Swatch() {
  Abstract.apply(this, arguments);
  $('.swatches a').on('click', click.bind(this));
  this.current = null;
  this.key = 'bodyClass';

  if(localStorage[this.key]) {
    $('body').addClass(localStorage[this.key]); 
  }
}

$.inherit(Swatch, Abstract);

/**
 *  Handle a swatch click.
 */
function click(e) {
  e.preventDefault();

  var el = $(e.currentTarget)
    , id = el.find('svg').attr('class')
    , body = $('body');

  if(body.hasClass(id)) {
    return false; 
  }

  if(this.current) {
    body.removeClass(this.current); 
  }

  body.addClass(id);

  $('.swatches a').removeClass('selected');
  el.addClass('selected');

  localStorage.setItem(this.key, id);

  this.current = id;
}

module.exports = Swatch;
