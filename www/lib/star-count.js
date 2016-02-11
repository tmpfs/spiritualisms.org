var $ = require('air')
  , Counter = require('./counter');

/**
 *  Logic for rendering the star counters.
 */
function StarCount(opts) {

  // id for event prefixes
  this.id = 'star';

  // link selector
  this.link = 'a.star';

  // counter display selector
  this.counter = 'a.star span';

  // must configure model before calling super
  this.model = opts.model.star;

  Counter.apply(this, arguments);

  this.notifier.on('star/toggle', this.toggle.bind(this));
  this.notifier.on('star/render', this.render.bind(this));
}

$.inherit(StarCount, Counter);

/**
 *  Add the link event handlers on initialization.
 */
function onInit(container, id) {
  this.toggle(id, this.model.has(id));
}

/**
 *  Toggle a star link view.
 */
function toggle(id) {

  var unstar = this.model.has(id);

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

function add(id, e) {
  e.preventDefault();
  this.notifier.emit('star/add', id, e);
}

function remove(id, e) {
  e.preventDefault();
  this.notifier.emit('star/remove', id, e);
}

[onInit, toggle, add, remove].forEach(function(m) {
  StarCount.prototype[m.name] = m;
});

module.exports = StarCount;
