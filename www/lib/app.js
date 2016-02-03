"use strict"

var $ = require('air')
  , Schema = require('async-validate')
  , descriptor = require('../../lib/schema/quote');

$.plugin(
  [
    require('air/append'),
    require('air/attr'),
    //require('air/children'),
    //require('air/class'),
    //require('air/clone'),
    require('air/create'),
    require('air/css'),
    //require('air/data'),
    require('air/event'),
    //require('air/filter'),
    require('air/find'),
    //require('air/first'),
    require('air/html'),
    require('air/parent'),
    require('air/request'),
    //require('air/remove'),
    //require('air/template'),
    require('air/text'),
    //require('air/val')
    //require('vivify'),
    //require('vivify/burst'),
    //require('vivify/flash'),
    //require('vivify/fade-in'),
    //require('vivify/fade-out')
  ]
)

function Application(opts) {
  var supported = typeof XMLHttpRequest !== 'undefined';

  // NOTE: show browser warning for styling
  //supported = false;

  opts = opts || {};
  this.opts = opts;
  this.validator = new Schema(descriptor);

  if(!supported) {
    $('.browser-update').css({display: 'block'});
  }

  $('a.refresh').on('click', random.bind(this));
}

/**
 *  Load a new random quote.
 */
function random(e) {
  e.preventDefault();

  var el = $(e.target)
    , container = $('.quotation');

  function onResponse(err, res) {
    var doc;
    if(err) {
      return console.error(err); 
    }
    if(res) {
      doc = JSON.parse(res); 
    }
    container.find('blockquote').text(doc.quote);
    container.find('cite').html('&#151; ')
      .append(
        $.el('a', {href: doc.link, title: doc.author + ' (' + doc.domain + ')'}
      ).text(doc.author));
    console.log(res);
  }
  $.request({url: this.opts.api + '/quote/random'}, onResponse.bind(this));
}

module.exports = Application;
