"use strict"

var $ = require('air')
  , Schema = require('async-validate')
  , descriptor = require('../../lib/schema/quote')
  , Love = require('./love')
  , Star = require('./star');

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
    require('air/parent'),
    require('air/prepend'),
    require('air/request'),
    require('air/remove'),
    require('air/template'),
    require('air/text'),
    //require('air/val')
    require('vivify'),
    //require('vivify/burst'),
    //require('vivify/flash'),
    require('vivify/fade-in'),
    require('vivify/fade-out')
  ]
)

/**
 *  Spiritualisms client-side application.
 */
function Application(opts) {
  var supported = typeof XMLHttpRequest !== 'undefined';

  // NOTE: show browser warning for styling
  //supported = false;

  opts = opts || {};
  this.opts = opts;
  this.validator = new Schema(descriptor);
  this.love = new Love(opts);
  this.star = new Star(opts);

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

  var love = this.love
    , star = this.star
    , last = $('.quotation').data('id')
    , icon = $(e.target).find('i')
    , container = $('.quotation')
    , start = new Date().getTime()
    , doc = false;

  function render() {
    if(doc) {
      container.data('id', doc.id);

      // clone to remove events
      var tools = container.find('nav.toolbar')
      var toolbar = tools.clone(true);
      toolbar.find('span').remove();

      // append clone
      tools.parent().append(toolbar);
      // remove original
      tools.remove();

      star.init();
      star.fetch([doc.id]);
      love.init();
      love.fetch([doc.id]);
      container.find('blockquote').text(doc.quote);
      container.find('cite').html('&#151; ')
        .append(
          $.el('a', {href: doc.link, title: doc.author + ' (' + doc.domain + ')'}
        ).text(doc.author));

      var nav = container.find('nav')
        , href = '/explore/' + doc.id;
      nav.find('a.love, a.star, a.permalink').attr({href: href});
      container.fadeIn(function() {
        container.css({opacity: 1}); 
      });
    }
  }

  function onResponse(err, res) {
    var duration = new Date().getTime() - start;
    if(err) {
      return console.error(err); 
    }

    doc = res.body;

    //container.css({display: 'none'});

    function complete() {
      icon.removeClass('fa-spin');
      render();
    }

    // animation completed before load: 1s animation
    if(duration >= 1000) {
      complete(); 
    }else{
      setTimeout(complete, 1000 - duration);
    }
  }

  var opts = {
    url: this.opts.api + '/quote/random',
    qs: {
      last: last 
    },
    json: true
  };

  $.request(opts, onResponse.bind(this));

  icon.addClass('fa-spin');
  container.fadeOut(function() {
    container.find('a.love span').text('');
    container.css(
      {
        opacity: 0,
      }
    ); 
  });
}

module.exports = Application;
