"use strict"

var $ = require('air')
  , Schema = require('async-validate')
  , descriptor = require('../../lib/schema/quote');

$.plugin(
  [
    //require('air/append'),
    //require('air/attr'),
    //require('air/children'),
    //require('air/class'),
    //require('air/clone'),
    require('air/css'),
    //require('air/data'),
    require('air/event'),
    //require('air/filter'),
    require('air/find'),
    //require('air/first'),
    //require('air/hidden'),
    require('air/parent'),
    require('air/request'),
    //require('air/remove'),
    //require('air/template'),
    //require('air/text'),
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

  $('a.more-inspiration').on('click', random.bind(this));
}

/**
 *  Load a new random quote.
 */
function random(e) {
  var el = $(e.target);
  function onResponse(err, res, info, xhr) {
    if(err) {
      return console.error(err); 
    }
    console.log(res);
  }
  $.request({url: this.opts.api + '/quote/random'}, onResponse.bind(this));
}

module.exports = Application;
