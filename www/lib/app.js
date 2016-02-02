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
    //require('air/find'),
    //require('air/first'),
    //require('air/hidden'),
    //require('air/parent'),
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
  //window.XmlHttpRequest = null;
  //console.log(typeof XMLHttpRequest);
  if(typeof XMLHttpRequest === 'undefined') {
    $('.browser-update').css({display: 'block'});
  }
  opts = opts || {};
  this.opts = opts;
  this.validator = new Schema(descriptor);
  $('a.more-inspiration').on('click', more.bind(this));
  //console.log(opts.api);
  //console.log($('body').length);
}

function more() {
  console.log('more called');
}

module.exports = Application;
