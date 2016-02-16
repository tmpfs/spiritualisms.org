"use strict"

var $ = require('air')

$.plugin(
  [
    require('air/append'),
    require('air/attr'),
    //require('air/children'),
    require('air/class'),
    require('air/clone'),
    require('air/create'),
    require('air/css'),
    require('air/data'),
    require('air/disabled'),
    require('air/event'),
    //require('air/filter'),
    require('air/find'),
    //require('air/first'),
    require('air/html'),
    require('air/hidden'),
    require('air/inherit'),
    require('air/parent'),
    require('air/prepend'),
    require('air/request'),
    require('air/remove'),
    require('air/template'),
    require('air/text'),

    require('air/ui/dialog'),

    //require('air/val')
    require('vivify'),
    //require('vivify/burst'),
    require('vivify/flash'),
    require('vivify/fade-in'),
    require('vivify/fade-out')
  ]
)

var EventEmitter = require('emanate')
  , Schema = require('async-validate')
  , descriptor = require('../../lib/schema/quote')
  , QuoteModel = require('./model/quote')
  , LoveModel = require('./model/love')
  , StarModel = require('./model/star')
  , LoveCount = require('./love-count')
  , StarCount = require('./star-count')
  , refresh = require('./refresh')
  , Stars = require('./stars');

/**
 *  Spiritualisms client-side application.
 */
function Application(opts) {
  var supported = typeof XMLHttpRequest !== 'undefined'
    && window.localStorage;

  // NOTE: show browser warning for styling
  //supported = false;

  opts = opts || {};
  opts.model = {
    quote: new QuoteModel(opts),
    love: new LoveModel(opts),
    star: new StarModel(opts)
  }
  this.opts = opts;
  this.opts.notifier = this.notifier = new EventEmitter();

  this.validator = new Schema(descriptor);

  this.love = new LoveCount(opts);
  this.star = new StarCount(opts);
  this.stars = new Stars(opts);

  if(!supported) {
    var notice = $('.browser-update');
    notice.css({display: 'block'}).fadeIn();
    if(document.location.pathname === '/home') {
      notice.css({top: '0'});
    }
  }else{
    this.notifier.emit('love/update');
    this.notifier.emit('star/update');
    $('a.refresh').on('click', refresh.bind(this));
  }

}

module.exports = Application;
