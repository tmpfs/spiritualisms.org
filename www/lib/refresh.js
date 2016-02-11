var $ = require('air');

/**
 *  Load a new random quote.
 */
function refresh(e) {
  e.preventDefault();

  var last = $('.quotation').data('id')
    , icon = $(e.currentTarget).find('i')
    , container = $('.quotation')
    , start = new Date().getTime()
    , doc = false
    , link = $('a.refresh')
    , render;

  link.disable();

  function update() {
    if(doc) {
      container.data('id', doc.id);

      var tools = container.find('nav.toolbar')

      // clone to remove events
      var toolbar = tools.clone(true);
      toolbar.find('span').remove();

      // append clone
      tools.parent().append(toolbar);
      // remove original
      tools.remove();

      // update star/love counters
      this.notifier.emit('star/update', [doc.id]);
      this.notifier.emit('love/update', [doc.id]);

      container.find('blockquote').text(doc.quote);
      container.find('cite').html('&#8212; ')
        .append(
          $.el('a', {href: doc.link, title: doc.author + ' (' + doc.domain + ')'}
        ).text(doc.author));

      var nav = container.find('nav')
        , href = '/explore/' + doc.id;
      nav.find('a.love, a.star, a.permalink').attr({href: href});
      container.fadeIn(function() {
        container.css({opacity: 1}); 
        link.enable();
      });
    }
  }

  render = update.bind(this);

  function onResponse(err, res) {
    var duration = new Date().getTime() - start;
    if(err) {
      return console.error(err); 
    }

    doc = res.body;

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

module.exports = refresh;
