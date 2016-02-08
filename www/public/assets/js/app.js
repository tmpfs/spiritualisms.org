require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
;(function() {
  'use strict'

  var plug = require('zephyr');

  /**
   *  Chainable wrapper class.
   *
   *  This is the core of the entire plugin system and typically you extend
   *  functionality by adding methods to the prototype of this function.
   *
   *  However a plugin may also add static methods to the main function,
   *  see the `create` plugin for an example of adding static methods.
   *
   *  This implementation targets modern browsers (IE9+) and requires that
   *  the array methods `isArray`, `forEach` and `filter` are available,
   *  for older browsers you will need to include polyfills.
   *
   *  @param el A selector, DOM element, array of elements or Air instance.
   *  @param context The context element for a selector.
   */
  function Air(el, context) {
    if(!(this instanceof Air)) {
      return new Air(el, context);
    }
    if(typeof context === 'string') {
      context = document.querySelector(context);
    }else if(context instanceof Air) {
      context = context.get(0);
    }
    context = context || document;
    // NOTE: do not pass empty string to querySelectorAll
    if(!arguments.length || el === '') {
      this.dom = []; 
    }else{
      this.dom = typeof el === 'string' ? context.querySelectorAll(el) : el;
    }
    if(el instanceof Air) {
      this.dom = el.dom.slice(0);
    }else if(!Array.isArray(el)) {
      if(this.dom instanceof NodeList) {
        this.dom = Array.prototype.slice.call(this.dom);
      }else{
        this.dom = (el instanceof Element || el === window) ? [el] : [];
      }
    }

    // shortcut to Array.prototype.slice
    this.slice = Array.prototype.slice;
  }

  var proto = Air.prototype
    , air = plug({proto: proto, type: Air});

  /**
   *  Get the number of wrapped DOM elements.
   */
  Object.defineProperty(
    proto, 'length', {get: function(){return this.dom.length}});

  /**
   *  Get the DOM element at the specified index.
   */
  proto.get = function get(index) {
    if(index === undefined) {
      return this.dom;
    }
    return this.dom[index];
  }

  /**
   *  Iterate the encapsulated DOM elements.
   */
  proto.each = function each(cb) {
    this.dom.forEach(cb);
    return this;
  }

  // expose class reference
  air.Air = Air;

  // alias main function
  proto.air = air;

  module.exports = air;
})();

},{"zephyr":18}],2:[function(require,module,exports){
/**
 *  Insert content, specified by the parameter, to the end of each
 *  element in the set of matched elements.
 */
function append() {
  var i, l = this.length, el, args = this.slice.call(arguments);
  function it(node, index) {
    // content elements to insert
    el.each(function(ins) {
      ins = (index < (l - 1)) ? ins.cloneNode(true) : ins;
      node.appendChild(ins);
    });
  }
  for(i = 0;i < args.length;i++) {
    // wrap content
    el = this.air(args[i]);
    // matched parent elements (targets)
    this.each(it);
  }
  return this;
}

module.exports = function() {
  this.append = append;
}

},{}],3:[function(require,module,exports){
/**
 *  Get the value of an attribute for the first element in the set of
 *  matched elements or set one or more attributes for every matched element.
 */
function attr(key, val) {
  var i, attrs, map = {};
  if(!this.length || key !== undefined && !Boolean(key)) {
    return this;
  }

  if(key === undefined && val === undefined) {
    // no args, get all attributes for first element as object
    attrs = this.dom[0].attributes;
    // convert NamedNodeMap to plain object
    for(i = 0;i < attrs.length;i++) {
      // NOTE: nodeValue is deprecated, check support for `value` in IE9!
      map[attrs[i].name] = attrs[i].value;
    }
    return map;
  }else if(typeof key === 'string' && !val) {
    // delete attribute on all matched elements
    if(val === null) {
      this.each(function(el) {
        el.removeAttribute(key);
      })
      return this;
    }
    // get attribute for first matched elements
    return this.dom[0].getAttribute(key);
  // handle object map of attributes
  }else {
    this.each(function(el) {
      if(typeof key === 'object') {
        for(var z in key) {
          if(key[z] === null) {
            el.removeAttribute(z);
            continue;
          }
          el.setAttribute(z, key[z]);
        }
      }else{
        el.setAttribute(key, val);
      }
    });
  }
  return this;
}

module.exports = function() {
  this.attr = attr;
}

},{}],4:[function(require,module,exports){
/**
 *  IE9 does not support `Element.classList`, when support for IE9 is
 *  dropped this can be refactored.
 */
var attr = 'class';

/**
 *  Adds the specified class(es) to each of the set of matched elements.
 */
function addClass(className) {
  if(!className) {
    return this;
  }
  var classes = className.split(/\s+/);
  this.each(function(el) {
    var val = el.getAttribute(attr);
    var names = val ? val.split(/\s+/) : [];
    classes.forEach(function(nm) {
      if(!~names.indexOf(nm)) {
        names.push(nm);
      }
    });
    el.setAttribute(attr, names.join(' '));
  });
  return this;
}

/**
 *  Determine whether any of the matched elements are assigned the
 *  given class.
 */
function hasClass(className) {
  var i, val;
  for(i = 0;i < this.length;i++) {
    val = this.get(i).getAttribute(attr);
    val = val ? val.split(/\s+/) : [];
    if(~val.indexOf(className)) {
      return true;
    }
  }
  return false;
}

/**
 *  Remove a single class, multiple classes, or all classes from
 *  each element in the set of matched elements.
 */
function removeClass(className) {
  if(!className) {
    // remove all classes from all matched elements
    this.each(function(el) {
      el.removeAttribute(attr);
    });
    return this;
  }
  var classes = className.split(/\s+/);
  this.each(function(el) {
    var val = el.getAttribute(attr);
    // no class attribute - nothing to remove
    if(!val) {
      return;
    }
    var names = val.split(/\s+/);
    names = names.filter(function(nm) {
      return ~classes.indexOf(nm) ? false : nm;
    });
    el.setAttribute(attr, names.join(' '));
  });
  return this;
}

/**
 *  Add or remove one or more classes from each element in the set of 
 *  matched elements depending on the class's presence.
 */
function toggleClass(className) {
  var classes = className.split(/\s+/)
    , name
    , i;
  for(i = 0;i < classes.length;i++) {
    name = classes[i];
    if(this.hasClass(name)) {
      this.removeClass(name)
    }else{
      this.addClass(name)
    }
  }
}

module.exports = function() {
  this.addClass = addClass;
  this.hasClass = hasClass;
  this.removeClass = removeClass;
  this.toggleClass = toggleClass;
}

},{}],5:[function(require,module,exports){
/**
 *  Create a deep copy of the set of matched elements.
 */
function clone() {
  var arr = [];
  this.each(function(el) {
    arr.push(el.cloneNode(true));
  });
  return this.air(arr);
}

module.exports = function() {
  this.clone = clone;
}

},{}],6:[function(require,module,exports){
/**
 *  Create a DOM element.
 *
 *  @param tag The element tag name.
 */
function create(tag) {
  return document.createElement(tag);
}

/**
 *  Create a text node.
 *
 *  @param txt The text for the node.
 */
function text(txt) {
  return document.createTextNode(txt);
}

/**
 *  Create a wrapped DOM element.
 *
 *  @param tag The element tag name.
 *  @param attrs Object map of element attributes.
 */
function el(tag, attrs) {
  var n = el.air(create(tag));
  if(attrs && n.attr) {
    return n.attr(attrs);
  }
  return n;
}

module.exports = function() {
  // static method needs access to main function
  // to wrap the created element
  el.air = this.air;

  this.air.create = create;
  this.air.el = el;
  this.air.text = text;
}

// optional `attr` dependency
//plugin.deps = {attr: false};

},{}],7:[function(require,module,exports){
/**
 *  Get the value of a computed style property for the first element
 *  in the set of matched elements or set one or more CSS properties
 *  for every matched element.
 */
function css(key, val) {
  var style, props;
  if(!this.length) {
    return this;
  }

  if(key && typeof key === 'object') {
    props = key;
  }else if(key && val) {
    props = {};
    props[key] = val;
  }

  // get style object
  if(key === undefined) {
    style = window.getComputedStyle(this.dom[0], null);
    // TODO: convert to plain object map?
    // for the moment return CSSStyleDeclaration
    return style;
  // get single style property value
  }else if(typeof key === 'string' && !val) {
    style = window.getComputedStyle(this.dom[0], null);
    return style.getPropertyValue(key);
  }

  // set inline styles
  this.each(function(el) {
    el.style = el.style;
    for(var z in props) {
      el.style[z] = '' + props[z];
    }
  });
  return this;
}

module.exports = function() {
  this.css = css;
}

},{}],8:[function(require,module,exports){
var prefix = 'data-';

/**
 *  Get a data attribute of the first matched element or
 *  set `data` attribute(s) on all matched elements.
 *
 *  Requires that the `attr` plugin has been loaded.
 */
function data(key, val) {
  var o = {}, z;

  function inject(name) {
    if(typeof name === 'string' && name.indexOf(prefix) !== 0) {
      name = prefix + name;
    }
    return name;
  }

  if(typeof key === 'string') {
    key = inject(key);
  }else if(typeof key === 'object') {
    for(z in key) {
      o[inject(z)] = key[z];
    }
    key = o;
  }

  return this.attr(key, val);
}

module.exports = function() {
  this.data = data;
}

// required `attr` dependency
//plugin.deps = {attr: true};

},{}],9:[function(require,module,exports){
function on(nm, cb, capture) {
  this.each(function(el) {
    el.addEventListener(nm, cb, capture);
  });
  return this;
}

function off(nm, cb, capture) {
  this.each(function(el) {
    el.removeEventListener(nm, cb, capture);
  });
  return this;
}

function trigger(event, bubbles, cancelable, type) {
  bubbles = typeof(bubbles) === undefined ? true : bubbles;
  cancelable = typeof(cancelable) === undefined ? true : cancelable;
  type = type || 'HTMLEvents';
  this.each(function(el) {
    var evt;
    if(document.createEvent) {
      // dispatch for firefox + others
      evt = document.createEvent(type);
      // event type,bubbling,cancelable
      evt.initEvent(event, bubbles, cancelable);
      return !el.dispatchEvent(evt);
    }else{
      // dispatch for IE
      evt = document.createEventObject();
      return el.fireEvent('on' + event, evt)
    }
  });
}

function click(bubbles, cancelable) {
  return this.trigger('click', bubbles, cancelable, 'MouseEvents');
}

module.exports = function() {
  this.on = on;
  this.off = off;
  this.trigger = trigger;
  this.click = click;
}

},{}],10:[function(require,module,exports){
/**
 *  Get the descendants of each element in the current set
 *  of matched elements, filtered by a selector.
 */
function find(selector) {
  var arr = [], $ = this.air, slice = this.slice;
  this.each(function(el) {
    arr = arr.concat(slice.call($(selector, el).dom));
  });
  return $(arr);
}

module.exports = function() {
  this.find = find;
}

},{}],11:[function(require,module,exports){
/**
 *  Get the HTML of the first matched element or set the HTML
 *  content of all matched elements.
 *
 *  Note that when using `outer` to set `outerHTML` you will likely invalidate
 *  the current encapsulated elements and need to re-run the selector to
 *  update the matched elements.
 */
function html(markup, outer) {
  if(!this.length) {
    return this;
  }
  if(typeof markup === 'boolean') {
    outer = markup;
    markup = undefined;
  }
  var prop = outer ? 'outerHTML' : 'innerHTML';
  if(markup === undefined) {
    return this.dom[0][prop];
  }
  markup = markup || '';
  this.each(function(el) {
    el[prop] = markup;
  });
  // TODO: should we remove matched elements when setting outerHTML?
  // TODO: the matched elements have been rewritten and do not exist
  // TODO: in the DOM anymore: ie: this.dom = [];
  return this;
}

module.exports = function() {
  this.html = html;
}

},{}],12:[function(require,module,exports){
/**
 *  Get the parent of each element in the current set of matched elements,
 *  optionally filtered by a selector.
 *
 *  TODO: implement selector filtering
 */
function parent(/*selector*/) {
  var arr = [], $ = this.air, slice = this.slice;
  this.each(function(el) {
    arr = arr.concat(slice.call($(el.parentNode).dom));
  });
  return $(arr);
}

module.exports = function() {
  this.parent = parent;
}

},{}],13:[function(require,module,exports){
/**
 *  Insert content, specified by the parameter, to the beginning of each
 *  element in the set of matched elements.
 */
function prepend() {
  var i, l = this.length, el, args = this.slice.call(arguments);
  function it(node, index) {
    // content elements to insert
    el.each(function(ins) {
      ins = (index < (l - 1)) ? ins.cloneNode(true) : ins;
      // no children yet - append
      if(!node.firstChild) {
        node.appendChild(ins);
      // insert before first child
      }else{
        node.insertBefore(ins, node.firstChild);
      }
    });
  }
  for(i = 0;i < args.length;i++) {
    // wrap content
    el = this.air(args[i]);
    // matched parent elements (targets)
    this.each(it);
  }
  return this;
}

module.exports = function() {
  this.prepend = prepend;
}

},{}],14:[function(require,module,exports){
/**
 *  Remove all matched elements.
 */
function remove() {
  var i, el;
  for(i = 0;i < this.length;i++) {
    el = this.dom[i];
    // if for some reason this point to the document element
    // an exception will occur, pretty hard to reproduce so
    // going to let it slide
    if(el.parentNode) {
      el.parentNode.removeChild(el);
      this.dom.splice(i, 1);
      i--;
    }
  }
  return this;
}

module.exports = function() {
  this.remove = remove;
}

},{}],15:[function(require,module,exports){
/**
 *  Thin wrapper for XMLHttpRequest using a 
 *  callback style.
 */
function request(opts, cb) {
  opts = opts || {};
  opts.method = opts.method || 'GET';
  opts.headers = opts.headers || {};

  var req
    , z;

  /* jshint ignore:start */
  req = new XMLHttpRequest();
  /* jshint ignore:end */

  /**
   *  Parse response headers into an object.
   */
  function parse(headers) {
    var output = {}, i, p, k, v;
    headers = headers || '';
    headers = headers.replace('\r', '');
    headers = headers.split('\n');
    for(i = 0;i < headers.length;i++) {
      p = headers[i].indexOf(':');
      k = headers[i].substr(0, p);
      v = headers[i].substr(p + 1);
      if(k && v) {
        k = k.replace(/^\s+/, '').replace(/\s+$/, '');
        v = v.replace(/^\s+/, '').replace(/\s+$/, '');
        output[k.toLowerCase()] = v;
      }
    }
    return output;
  }

  function done() {
    req.onload = null;
    req.onerror = null;
    req.ontimeout = null;
    req.onprogress = null;
    cb.apply(null, arguments); 
  }

  if(opts.fields) {
    for(z in opts.fields) {
      req[z] = opts.fields[z];
    }
  }

  opts.headers['X-Requested-With'] = 'XMLHttpRequest';

  if(opts.json) {
    opts.headers['Content-Type'] = 'application/json';
    if(opts.body !== undefined) {
      opts.body = JSON.stringify(opts.body); 
    }
  }

  req.open(opts.method, opts.url);

  // apply custom request headers
  for(z in opts.headers) {
    req.setRequestHeader(z, opts.headers[z]);
  }

  if(opts.mime && typeof(req.overrideMimeType) === 'function') {
    req.overrideMimeType(opts.mime);
  }

  req.onreadystatechange = function() {
    if(this.readyState === 4) {
      done(
        null,
        this.responseText,
        {headers: parse(this.getAllResponseHeaders()), status: this.status},
        this);
    }
  }

  req.onerror = opts.error || function onError(err) {
    done(err);
  }

  req.onload = opts.load;
  req.ontimeout = opts.timeout;
  req.onprogress = opts.progress;

  req.send(opts.body);
}

module.exports = function() {
  this.air.request = request;
}

},{}],16:[function(require,module,exports){
var $
  , slice = Array.prototype.slice;

/**
 *  Get a map of template elements.
 *
 *  Source object is id => selector,
 *  target object is id => elements(s).
 */
function template(source, target) {
  source = source || {};
  target = target || {};
  for(var z in source) {
    target[z] = $.partial(source[z]);
  }
  return target;
}

/**
 *  Find all template element(s) by selector.
 */
function partial(selector) {
  var templates = $('template')
    , context
    , arr = [];
  templates.each(function(el) {
    context = el && el.content ? el.content : el;
    arr = arr.concat(slice.call($(selector, context).dom));
  })
  return $(arr);
}

/**
 *  Swap a source list of element's with a target list of element's.
 *
 *  The target elements are cloned as they should be template partials, the
 *  source element(s) should exist in the DOM.
 */
function swap(source, target) {
  // wrap to allow string selectors, arrays etc.
  source = $(source);
  target = $(target);
  source.each(function(el, index) {
    var content = target.get(index);
    if(el.parentNode && content) {
      // deep clone template partial
      content = content.cloneNode(true);
      // replace sourc element with cloned target element
      el.parentNode.replaceChild(content, el);
    }
  })
}

module.exports = function() {
  $ = this.air;
  this.air.template = template;
  this.air.partial = partial;
  this.air.swap = swap;
}

},{}],17:[function(require,module,exports){
/**
 *  IE9 supports textContent and innerText has various issues.
 *
 *  See: https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
 *  See: http://www.kellegous.com/j/2013/02/27/innertext-vs-textcontent/
 */
function text(txt) {
  if(!this.length) {
    return this;
  }
  if(txt === undefined) {
    return this.dom[0].textContent;
  }
  txt = txt || '';
  this.each(function(el) {
    el.textContent = txt;
  });
  return this;
}

module.exports = function() {
  this.text = text;
}

},{}],18:[function(require,module,exports){
;(function() {
  'use strict'

  function plug(opts) {
    opts = opts || {};

    /**
     *  Default plugin class.
     */
    function Component(){}

    var main
      , hooks = opts.hooks
      , proto = opts.proto || Component.prototype;

    /**
     *  Plugin method.
     *
     *  @param plugins Array of plugin functions.
     */
    function plugin(plugins) {
      var z, method, conf;
      for(z in plugins) {
        if(typeof plugins[z] === 'function') {
          method = plugins[z];
        }else{
          method = plugins[z].plugin;
          conf = plugins[z].conf;
        }
        if(opts.field && typeof method[opts.field] === 'function') {
          method = method[opts.field];
        }
        method.call(proto, conf);
      }
      return main;
    }

    /**
     *  Create an instance of the class represented by *Type* and proxy
     *  all arguments to the constructor.
     */
    function construct() {
      var args = Array.prototype.slice.call(arguments);
      function Fn() {
        return main.Type.apply(this, args);
      }
      Fn.prototype = main.Type.prototype;
      return new Fn();
    }

    /**
     *  Invoke constructor hooks by proxying to the main construct
     *  function and invoking registered hook functions in the scope
     *  of the created component.
     */
    function hook() {
      var comp = hook.proxy.apply(null, arguments);
      for(var i = 0;i < hooks.length;i++) {
        hooks[i].apply(comp, arguments);
      }
      return comp;
    }

    /**
     *  Register a constructor hook function.
     *
     *  @param fn The constructor hook.
     */
    function register(fn) {
      if(typeof fn === 'function' && !~hooks.indexOf(fn)) {
        hooks.push(fn);
      }
    }

    main = opts.main || construct;

    // hooks enabled, wrap main function aop style
    if(Array.isArray(hooks)) {
      hook.proxy = main;
      main = hook;
    }

    // class to construct
    main.Type = opts.type || Component;

    // static and instance plugin method
    main.plugin = proto.plugin = opts.plugin || plugin;

    // hooks enabled, decorate with register function
    if(Array.isArray(hooks)) {
      main.plugin.register = register;
    }

    // reference to the main function for static assignment
    proto.main = main;

    return main;
  }

  module.exports = plug;
})();

},{}],19:[function(require,module,exports){
module.exports = {
  type: 'object',
  fields: {
    type: {type: 'string', required: true},
    publish: {type: 'boolean'},
    quote: {type: 'string', required: true},
    author: {type: 'string', required: true},
    link: [
      {type: 'string', required: true}
      // TODO: implement protocol validation
    ],
    domain: [
      {type: 'string'}
      // TODO: implement tld validation
    ],
    created: {type: 'integer', required: true},
    random: {type: 'float', required: true},
    tags: {type: 'array'}
  }
}

},{}],20:[function(require,module,exports){
function mapSeries(list, cb, complete) {
  var item = list.shift()
    , out = [];
  function run(item) {
    cb(item, function(err, result) {
      if(err) {
        return complete(err, out); 
      } 
      out.push(result);
      item = list.shift();
      if(item) {
        return run(item);
      }
      complete(null, out);
    }); 
  }
  if(item) {
    return run(item); 
  }
  complete(null, out);
}

function map(list, cb, complete) {
  var out = []
    , e;
  function run(item, index) {
    cb(item, function(err, result) {
      // do not call complete again on error
      // condition
      if(e) {
        return; 
      }else if(err) {
        e = err;
        return complete(err, out);
      } 
      out[index] = result;
      if(out.length === list.length) {
        return complete(null, out);
      }
    }); 
  }
  list.forEach(function(item, index) {
    run(item, index);
  });
}

module.exports = {
  map: map,
  mapSeries: mapSeries
}

},{}],21:[function(require,module,exports){
function Reason(id, meta) {
  for(var k in meta) {
    this[k] = meta[k];
  }
  this.id = id;
}

Reason.prototype.toString = function() {
  return this.id;
}

var reasons = {
  type: new Reason('type'),
  required: new Reason('required'),
  pattern: new Reason('pattern'),
  length: new Reason('length'),
  instance: new Reason('instanceof'),
  additional: new Reason('additional'),
  enumerable: new Reason('enum'),
  date: new Reason('date'),
  whitespace: new Reason('whitespace'),
  min: new Reason('min'),
  max: new Reason('max')
}

Reason.reasons = reasons;

module.exports = Reason;

},{}],22:[function(require,module,exports){
var plugin = require('zephyr')
  , format = require('format-util')
  , Reason = require('./reason');

/**
 *  Represents a rule associated with a value to validate.
 */
function Rule(opts) {
  if(!(this instanceof Rule)) {
    return new Rule(opts);
  }

  for(var k in opts) {
    this[k] = opts[k];
  }

  // reason constants
  this.reasons = Reason.reasons;
}

/**
 *  @private
 *
 *  Helper for creating validation errors.
 *
 *  If a rule has a message property it takes precedence.
 *
 *  @param reason A reason for the validation error.
 *  @param message A custom messaage for the error.
 *  @param ... Replacement parameters passed to format.
 */
function error(message) {
  var msg
    , err
    , res
    , args = Array.prototype.slice.call(arguments, 1)
    , reason
    , tmp;

  // allow reason as first argument
  if(message instanceof Reason) {
    reason = message;
    message = arguments[1];
    args = args.slice(1);
  }

  if(typeof(this.rule.message) === 'function') {
    // allow calls to error() so that message functions
    // may call `this.error()` and not create a stack
    // overflow, if the function returns an error it is used
    tmp = this.rule.message;
    this.rule.message = null;
    res = tmp.call(this, message, args);
    this.rule.message = tmp;
    if(res instanceof Error) {
      err = res;
    }else{
      msg = '' + res;
    }
  }else{
    msg = typeof(this.rule.message) === 'string'
      ? this.rule.message
      : message
          || format(require('../messages').default, this.field);
  }

  if(typeof this.rule.message === 'object'
    && reason
    && this.rule.message[reason]) {
    msg = this.rule.message[reason];
  }

  if(typeof(msg) === 'string'
    && arguments.length > 1 && !this.rule.message) {
    msg = format.apply(null, [msg].concat(args));
  }

  err = err || new Error(msg);
  err.field = this.field;
  err.value = this.value;
  err.parent = this.parent;
  err.names = this.names;
  err.key = this.key || err.field;

  //console.dir('raising error with names: ' + this.names);

  if(!this.key && this.names && this.names.length) {
    err.key = this.names.join('.');
  }

  //console.dir(err.key);

  if(reason) {
    err.reason = reason; 
  }
  return err;
}

/**
 *  Get a new error reason.
 */
function reason(id, opts) {
  return new Reason(id, opts);
}

/**
 *  Create an error and adds it to the list of errors to be reported.
 */
function raise(message) {
  var parameters = [];
  if(arguments.length > 1) {
    parameters = Array.prototype.slice.call(arguments, 1);
  }
  var err = this.error.apply(this, [message].concat(parameters));
  this.errors.push(err);
  return err;
}

/**
 *  Determine if validation is required for a field.
 */
function validates() {
  if(this.isRoot()) {
    return true; 
  }else if(this.value === undefined && !this.rule.required) {
    return false;
  }
  return this.rule.required
    || (!this.rule.required && this.source.hasOwnProperty(this.field));
}

/**
 *  Determine is additional fields are present.
 */
function diff(expected, received) {
  var i
    , results = received.slice(0);
  for(i = 0;i < results.length;i++) {
    if(~expected.indexOf(results[i])) {
      results.splice(i, 1);
      i--;
    }  
  }
  // no additional fields found
  if(results.length === 0) {
    return false;
  }
  // return diff array
  return results;
}

/**
 *  Determine if we are validating the root source object.
 */
function isRoot() {
  return this.source === this.value;
}

Rule.prototype.reason = reason;
Rule.prototype.error = error;
Rule.prototype.raise = raise;
Rule.prototype.format = format;
Rule.prototype.isRoot = isRoot;
Rule.prototype.validates = validates;
Rule.prototype.diff = diff;

module.exports = plugin({type: Rule, proto: Rule.prototype});

},{"../messages":24,"./reason":21,"format-util":25,"zephyr":26}],23:[function(require,module,exports){
var iterator = require('./iterator')
  , format = require('format-util')
  , Rule = require('./rule');

/**
 *  @private
 *
 *  Validate the type field.
 */
function validateRule(rule) {
  var i;

  if(typeof(rule) === 'function' || typeof(rule.test) === 'function') {
    return true;
  }

  function invalid() {
    throw new Error(
      'type property must be string or function: ' + rule.field); 
  }

  function isValid(type) {
    return type 
      && (typeof(type) === 'string' || typeof(type) === 'function');
  }

  if(Array.isArray(rule.type)) {
    for(i = 0;i < rule.type.length;i++) {
      if(!isValid(rule.type[i])) {
        invalid();
      } 
    }
  }else if(!isValid(rule.type)) {
    invalid(); 
  }
}

/**
 *  Encapsulates a validation schema.
 *
 *  @param rules Validation rules for this schema.
 *  @param opts Options for the schema.
 */
function Schema(rules, opts) {
  opts = opts || {};

  if(rules === undefined) {
    throw new Error('Cannot configure a schema with no rules');
  }

  if(!rules || typeof rules !== 'object' && typeof rules !== 'function') {
    throw new Error('Rules must be an object')
  }

  this.messages(opts.messages || require('../messages'));
  this.rules = rules;
}

/**
 *  Get or set the messages used for this schema.
 *
 *  @param msg The validation messages.
 *
 *  @return The validation messages.
 */
function messages(msg) {
  if(msg!== undefined) {
    this._messages = msg;
  }
  return this._messages;
}

/**
 *  Validate an object against this schema.
 *
 *  @param source The object to validate.
 *  @param opts Validation options.
 *  @param cb Callback  to invoke when validation is complete.
 */
function validate(source, opts, cb) {
  if(typeof opts === 'function') {
    cb = opts;
    opts = null;
  }
  opts = opts || {};

  if(source === undefined && !opts._deep) {
    throw new Error('Cannot validate with no source.');
  }else if(typeof cb !== 'function') {
    throw new Error('Cannot validate with no callback.');
  }

  if(opts.bail) {
    opts.first = opts.single = true; 
  }

  var series = []
    , k
    , z
    , matcher
    , matchtmp
    , fields = this.rules.fields
    , state = opts.state || {}
    // iterator function series/parallel
    , func = opts.parallel ? iterator.map : iterator.mapSeries
    // configure messages to use defaults where necessary
    , messages = opts.messages || this.messages();

  for(k in fields) {
    if(typeof fields[k] === 'object'
      && (fields[k].match instanceof RegExp)) {
      matcher = fields[k];
      delete fields[k];
      for(z in source) {
        if(matcher.match.test(z)) {
          matchtmp = Schema.clone(matcher);
          delete matchtmp.match;
          fields[z] = getRule(matchtmp, z, source[z]);
        }
      } 
    } 
  }

  this.rules = opts._deep ? this.rules : clone(this.rules);

  series = Array.isArray(this.rules) ? this.rules : [this.rules];

  function getRule(rule, field, value) {
    var assign;

    value = value || source
    rule.field = field || opts.field || 'source';

    if(typeof rule.resolve === 'function') {
      rule = rule.resolve.call(value); 
    }

    // default value placeholder
    if(value === undefined
      && typeof rule.placeholder === 'function') {
      value = assign = rule.placeholder(); 
    }

    // handle transformation
    if(typeof(rule.transform) === 'function') {
      value = assign = rule.transform(value);
    }

    if(assign && opts.parent && rule.field) {
      opts.parent[rule.field] = assign; 
    }

    // handle instanceof tests for object type
    if(typeof rule.type === 'function') {
      rule.Type = rule.type;
      rule.type = 'object'; 
    }

    validateRule(rule);

    if(typeof(rule.test) !== 'function'
      && Array.isArray(rule.type)) {
      rule.test = Rule.types;
    }

    if(typeof rule === 'function') {
      rule.test = rule;
    }else if(typeof rule.test !== 'function') {
      // scope plugin functions are static methods
      rule.test = Rule[rule.type];
    }

    rule.names = opts._names || [];

    if(rule.field && opts._deep) {
      rule.names = rule.names.concat(rule.field);
    }

    rule.parent = opts.parent || source;
    rule.value = value;
    rule.source = opts._source || source;

    if(typeof rule.test !== 'function') {
      throw new Error(format('Unknown rule type %s', rule.type));
    }

    return rule;
  }

  series = series.map(function(rule) {
    return getRule(rule);
  });

  // iterate list data
  func(series, function(rule, callback) {

    var vars = {}
      , k
      , scope
      , isDeep;

    // assign rule fields first
    for(k in rule) {
      // do not overwrite existing fields, eg: helper functions
      if(Rule.Type.prototype[k] === undefined) {
        vars[k] = rule[k];
      }
    }

    // next transient variables
    if(opts.vars) {
      for(k in opts.vars) {
        vars[k] = opts.vars[k]; 
      } 
    }

    // final built in properties
    vars.rule = rule;
    vars.field = rule.field;
    vars.value = rule.value;
    vars.source = rule.source;
    vars.names = rule.names;
    vars.errors = [];
    vars.state = state;
    vars.messages = messages;

    scope = Rule(vars);

    isDeep = (rule.type === 'object' || rule.type === 'array')
      && typeof(rule.fields) === 'object';
    isDeep = isDeep && (rule.required || (!rule.required && rule.value));

    function onValidate(err) {

      if(err) {
        return callback(err, scope.errors); 
      }

      // not deep so continue on to next in series
      if(!isDeep) {
        return callback(err, scope.errors);

      // generate temp schema for nested rules
      }else{

        var keys = opts.keys || Object.keys(rule.fields);

        func(keys, function iterator(key, cb) {

          // nested options for property iteration
          var options = clone(opts)
            , descriptor = rule.fields[key]
            , value = rule.value[key]
            , schema
            , i
            , len
            , tmp;

          // state object is by pointer
          options.state = state;

          if(descriptor.type === 'array'
              && typeof descriptor.values === 'object') {

            // wrap objects as arrays
            len = Array.isArray(descriptor.values)
              ? descriptor.values.length : Array.isArray(value)
                ? value.length : 0;

            if(len) {
              descriptor.fields = {};
            }

            // object declaration applies to all array values
            if(!Array.isArray(descriptor.values)) {
              for(i = 0;i < len;i++) {
                descriptor.fields[i] = descriptor.values;
              } 
            }else{
              for(i = 0;i < len;i++) {
                descriptor.fields[i] = descriptor.values[i];
              } 
            }
          }

          // if rule is required but the target object
          // does not exist fail at the rule level and don't
          // go deeper
          if(descriptor.required && value === undefined) {
            tmp = Rule({
              field: key,
              rule: descriptor,
              names: rule.names,
              key: rule.names.concat(key).join('.'),
              errors: scope.errors
            });
            tmp.raise(tmp.reasons.required, messages.required, key);
            return cb();
          }

          schema = new Schema(descriptor, {messages: options.messages});

          options.field = key;
          options.parent = rule.value;
          // important to maintain original source for isRoot()
          options._source = source;
          options._names = rule.names;
          options._deep = true;

          schema.validate(value, options, function(err, res) {
            if(res && res.errors.length) {
              scope.errors = scope.errors.concat(res.errors); 
            }
            cb(err, null);
          });
        }, function(err) {
          // bail on first error
          if(opts.first && scope.errors && scope.errors.length) {
            return complete(err, scope.errors, opts, cb);
          }
          callback(err, scope.errors); 
        })
      }
    }

    // invoke rule validation function
    rule.test.call(scope, onValidate);

  }, function(err, results) {
    complete(err, results, opts, cb);
  });
}

/**
 *  @private
 *
 *  Collates the errors arrays and maps field names to errors
 *  specific to the field.
 *
 *  Invokes callback when done.
 */
function complete(err, results, opts, callback) {
  var i
    , field
    , errors = []
    , fields = {};

  for(i = 0;i < results.length;i++) {
    errors = errors.concat(results[i]);
  }

  if(errors.length) {
    if(opts.single) {
      errors = errors.slice(0,1);
    }
    for(i = 0;i < errors.length;i++) {
      field = errors[i].key;
      fields[field] = fields[field] || [];
      fields[field].push(errors[i]);
    }
  }

  callback(err, !errors.length ? null : {errors: errors, fields: fields});
}


/**
 *  Clone helper function.
 */
function clone(source, target) {
  var k
    , v;

  function isComplex(obj) {
    return Array.isArray(obj)
      || (obj && typeof obj === 'object') && !(obj instanceof RegExp);
  }

  // simple source object
  if(!isComplex(source)) {
    return source; 
  }

  target = target || (Array.isArray(source) ? [] : {});
  for(k in source) {
    v = source[k];
    if(isComplex(v)) {
      target[k] = Array.isArray(v) ? [] : {};
      clone(v, target[k]);
    }else{
      target[k] = v;
    }
  }
  return target;
}

Schema.prototype.messages = messages;
Schema.prototype.validate = validate;

// static
Schema.clone = clone;
Schema.plugin = Rule.plugin;

module.exports = Schema;

},{"../messages":24,"./iterator":20,"./rule":22,"format-util":25}],24:[function(require,module,exports){
/**
 *  Default validation error messages.
 */
var messages = {
  default: 'error on field %s',
  required: '%s is required',
  enum: '%s must be one of %s',
  whitespace: '%s cannot be empty',
  additional: 'extraneous fields (%s) found in %s',
  date: {
    format: '%s date %s is invalid for format %s',
    invalid: '%s date %s is invalid'
  },
  types: {
    string: '%s is not a %s',
    null: '%s is not %s',
    function: '%s is not a %s',
    instance: '%s is not an instance of %s',
    array: '%s is not an %s',
    object: '%s is not an %s',
    number: '%s is not a %s',
    boolean: '%s is not a %s',
    integer: '%s is not an %s',
    float: '%s is not a %s',
    regexp: '%s is not a valid %s',
    multiple: '%s is not one of the allowed types %s'
  },
  function: {
    len: '%s must have exactly %s arguments',
    min: '%s must have at least %s arguments',
    max: '%s cannot have more than %s arguments',
    range: '%s must have arguments length between %s and %s'
  },
  string: {
    len: '%s must be exactly %s characters',
    min: '%s must be at least %s characters',
    max: '%s cannot be longer than %s characters',
    range: '%s must be between %s and %s characters'
  },
  number: {
    len: '%s must equal %s',
    min: '%s cannot be less than %s',
    max: '%s cannot be greater than %s',
    range: '%s must be between %s and %s'
  },
  array: {
    len: '%s must be exactly %s in length',
    min: '%s cannot be less than %s in length',
    max: '%s cannot be greater than %s in length',
    range: '%s must be between %s and %s in length'
  },
  pattern: {
    mismatch: '%s value %s does not match pattern %s'
  }
};

module.exports = messages;

},{}],25:[function(require,module,exports){
function format(fmt) {
  var re = /(%?)(%([jds]))/g
    , args = Array.prototype.slice.call(arguments, 1);
  if(args.length) {
    fmt = fmt.replace(re, function(match, escaped, ptn, flag) {
      var arg = args.shift();
      switch(flag) {
        case 's':
          arg = '' + arg;
          break;
        case 'd':
          arg = Number(arg);
          break;
        case 'j':
          arg = JSON.stringify(arg);
          break;
      }
      if(!escaped) {
        return arg; 
      }
      args.unshift(arg);
      return match;
    })
  }

  // arguments remain after formatting
  if(args.length) {
    fmt += ' ' + args.join(' ');
  }

  // update escaped %% values
  fmt = fmt.replace(/%{2,2}/g, '%');

  return '' + fmt;
}

module.exports = format;

},{}],26:[function(require,module,exports){
arguments[4][18][0].apply(exports,arguments)
},{"dup":18}],27:[function(require,module,exports){
module.exports = function() {

  /**
   *  Sequence class name manipulation over time.
   *
   *  Dependencies:
   *
   *  * air/attr
   *  * air/class
   *  * air/hidden
   *
   *  @param opts The options.
   */
  function vivify(opts, cb) {
    if(typeof opts === 'string') {
      opts = {start: opts};
    }

    opts = opts || {};
    opts.wait = opts.wait !== undefined ? opts.wait : 0;
    opts.delay = opts.delay || 500;
    opts.begin = opts.begin || 'animated';

    if(opts.infinite) {
      opts.begin += ' infinite';
    }

    cb = cb || function noop(){};
    cb = cb.bind(this);

    //console.log(opts);

    this.removeClass(opts.begin);
    this.removeClass(opts.start);

    // classes to add at the beginning
    if(opts.begin) {
      this.addClass(opts.begin);
    }

    var stop = function stop() {
      if(!opts.infinite) {
        this.removeClass(opts.start);
        this.removeClass(opts.begin);
      }

      if(opts.pause) {
        setTimeout(cb, opts.pause);
      }else{
        cb();
      }
    }.bind(this);

    var start = function start() {

      // must have loaded the air/hidden plugin
      if(opts.show) {
        this.show();
      }

      this.addClass(opts.start);
      setTimeout(stop, opts.delay);
    }.bind(this);

    // NOTE: often need a timeout to delay before adding the
    // NOTE: animation class to allow the browser to
    // NOTE: render the element
    if(opts.wait) {
      setTimeout(start, opts.wait);
    }else{
      start();
    }

    return this;
  }

  this.vivify = vivify;
}

},{}],28:[function(require,module,exports){
module.exports = function() {

  /**
   *  Fade an element in.
   */
  function fadeIn(opts, cb) {
    if(typeof opts === 'function') {
      cb = opts;
      opts = null;
    }
    if(opts) {
      opts.start = 'fadeIn';
    }
    return this.vivify.call(this, opts || 'fadeIn', cb);
  }

  this.fadeIn = fadeIn;
}

},{}],29:[function(require,module,exports){
module.exports = function() {

  /**
   *  Fade an element out.
   */
  function fadeOut(opts, cb) {
    if(typeof opts === 'function') {
      cb = opts;
      opts = null;
    }
    if(opts) {
      opts.start = 'fadeOut';
    }
    return this.vivify.call(this, opts || 'fadeOut', cb);
  }

  this.fadeOut = fadeOut;
}

},{}],30:[function(require,module,exports){
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
    }else if(res) {
      doc = JSON.parse(res); 
    }

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

  $.request({url: this.opts.api + '/quote/random'}, onResponse.bind(this));

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

},{"../../lib/schema/quote":19,"./love":31,"./star":33,"air":"air","air/append":2,"air/attr":3,"air/class":4,"air/clone":5,"air/create":6,"air/css":7,"air/data":8,"air/event":9,"air/find":10,"air/html":11,"air/parent":12,"air/prepend":13,"air/remove":14,"air/request":15,"air/template":16,"air/text":17,"async-validate":23,"vivify":27,"vivify/fade-in":28,"vivify/fade-out":29}],31:[function(require,module,exports){
var $ = require('air');

/**
 *  Render the love counters.
 */
function render(doc) {
  var ids = Object.keys(doc);
  ids.forEach(function(id) {
    var el = $('.quotation[data-id="' + id + '"]')
      , txt = el.find('a.love span');
    if(!txt.length) {
      el.find('a.love').append($.create('span'));
    }
    if(doc[id]) {
      el.find('a.love span').addClass('love').text('' + doc[id]);
    }
  })
}

/**
 *  Loads the love counters for all quotes.
 */
function fetch(ids) {
  if(!ids) {
    ids = [];
    this.quotes.each(function(el) {
      ids.push($(el).data('id'));
    })
  }

  // no elements on page
  if(!ids.length) {
    return; 
  }

  function onResponse(err, res) {
    var doc;
    if(err) {
      return console.error(err); 
    }else if(res) {
      doc = JSON.parse(res); 
    }
    //console.log(doc);
    render(doc);
  }
  var opts = {
    url: this.opts.api + '/quote/love',
    method: 'POST',
    json: true,
    body: ids
  };

  $.request(opts, onResponse.bind(this));
}

/**
 *  Show your love, increments the love counter.
 */
function show(id, e) {
  e.preventDefault();
  function onResponse(err, res) {
    var doc;
    if(err) {
      return console.error(err); 
    }else if(res) {
      doc = JSON.parse(res); 
    }
    render(doc);
  }
  var opts = {
    url: this.opts.api + '/quote/' + id + '/love',
    method: 'POST'
  };

  $.request(opts, onResponse.bind(this));
}

function init() {
  var scope = this;
  this.quotes = $('.quotation[data-id]');
  this.quotes.each(function(el) {
    el = $(el);
    var id = el.data('id');
    var show = scope.show.bind(scope, id);
    el.find('a.love').on('click', show);
  })
}

/**
 *  Love handlers.
 */
function Love(opts) {
  this.opts = opts;
  //this.render = render.bind(this);
  //this.fetch = fetch.bind(this);
  //this.init = init.bind(this);
  this.init();
  this.fetch();
}

[render, fetch, init, show].forEach(function(m) {
  Love.prototype[m.name] = m;
});

module.exports = Love;

},{"air":"air"}],32:[function(require,module,exports){
/* jshint ignore:start */
var Application = require('./app');
module.exports = new Application(window.app);
/* jshint ignore:end */

},{"./app":30}],33:[function(require,module,exports){
var $ = require('air');

/**
 *  Utility to determine if localStorage or sessionStorage 
 *  is supported.
 */
function storageAvailable(type) {
	try {
		var storage = window[type],
			x = '__storage_test__';
		storage.setItem(x, x);
		storage.removeItem(x);
		return storage;
	}catch(e) {
		return false;
	}
}

function Star(opts) {
  this.opts = opts;
  this.storage = storageAvailable('localStorage');
  this.key = 'stars';

  if(this.storage) {
    var nav = $('nav.main');
    var el = $.el('a')
      .attr({href: '/stars', title: 'Stars'})
      .addClass('stars')
      .html('&nbsp;Stars');
    el.prepend($.el('i').addClass('fa fa-star'));
    nav.append(el);

    this.totals();

    $('.actions .export').on('click', exporter.bind(this));
    $('.actions .clear').on('click', clear.bind(this));

    if(opts.uri.pathname === '/stars') {
      nav.find('a.stars').addClass('selected');
      this.list();
    }else{
      // only call fetch here on non /stars page
      // for /stars fetch will be called after rendering
      // the listing
      this.init();
      this.fetch();
    }
  }
}

function exporter(e) {
  e.preventDefault();
  var blob = new Blob(
    [JSON.stringify(this.read(), undefined, 2)], {type: 'application/json'})
    , file = 'stars.json';
  // requires file-saver.js to be loaded
  window.saveAs(blob, file, true);
}

function clear(e) {
  e.preventDefault();

  // remove storage
  localStorage.removeItem(this.key);

  // show initial message, remove listings etc.
  this.list();

  // update totals display
  this.totals();
}

function init() {
  var scope = this;
  this.quotes = $('.quotation[data-id]');
  this.quotes.each(function(el) {
    el = $(el);
    var id = el.data('id')
      , add = scope.add.bind(scope, id)
      , remove = scope.remove.bind(scope, id)
      , link = el.find('a.star');
    if(scope.has(id)) {
      $.swap('.quotation[data-id="' + id + '"] a.star', $.partial('a.unstar'));
      el.find('a.unstar').on('click', remove);
    }else{
      link.on('click', add);
    }
  })
}

/**
 *  Add a star to the list of stars.
 */
function add(id, e) {
  var scope = this;
  e.preventDefault();

  if(this.has(id)) {
    return false; 
  }

  function onResponse(err, res) {
    var doc;
    if(err) {
      return console.error(err); 
    }else if(res) {
      doc = JSON.parse(res); 
    }
    scope.write(id);
    scope.render(doc);
    scope.totals();
  }
  var opts = {
    url: this.opts.api + '/quote/' + id + '/star',
    method: 'POST',
    json: true
  };

  $.request(opts, onResponse.bind(this));
}

/**
 *  Render count totals in main navigation.
 */
function totals() {
  var len = this.count()
    , el = $('nav.main');
  if(len > 0) {
    el.find('a.stars span').remove();
    el.find('a.stars').append($.create('span'));
    el.find('a.stars span').addClass('star').text('' + len);
  }else{
    el.find('a.stars span').remove();
  }
}

/**
 *  Count the number of stars for this user.
 */
function count() {
  var ids = this.read();
  return ids.length;
}

/**
 *  Remove a star from the list of stars.
 */
function remove(id, e) {
  e.preventDefault();
  // TODO: remove a star from the storage
  console.log('remove: ' + id);
}

/**
 *  Read the array of ids from the local storage.
 */
function read() {
  var ids = localStorage.getItem(this.key);
  if(ids) {
    try {
      ids = JSON.parse(ids); 
    }catch(e) {
      ids = [];
    }
  }
  return ids || [];
}

/**
 *  Write an id to the local storage.
 */
function write(id) {
  var ids = this.read();
  if(!~ids.indexOf(id)) {
    ids.push(id); 
  }
  localStorage.removeItem(this.key);
  localStorage.setItem(this.key, JSON.stringify(ids));
  return ids;
}

/**
 *  Determine if a star already exists.
 */
function has(id) {
  var ids = this.read();
  return Boolean(~ids.indexOf(id));
}

/**
 *  List stars.
 *
 *  Reads the list of identifiers and loads the documents from the 
 *  server.
 */
function list() {
  var scope = this;
  var ids = this.read();

  function onResponse(err, res) {
    var doc;
    if(err) {
      return console.error(err); 
    }else if(res) {
      doc = JSON.parse(res); 
    }
    scope.listing(doc);
  }

  if(!ids.length) {
    $('.empty').css({display: 'block'});
    $('.actions .export').addClass('disabled');
    $('.actions .clear').addClass('disabled');

    // remove any listings
    $('.listing > *').remove();

  }else{
    $('.actions .clear').removeClass('disabled');

    var opts = {
      url: this.opts.api + '/quote',
      method: 'POST',
      json: true,
      body: ids
    };

    $.request(opts, onResponse.bind(this));
  }
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
    cite.html('&#151; ');
    cite.append(
        $.el('a',
          {href: doc.link, title: doc.author + ' (' + doc.domain + ')'})
            .text(doc.author)
    );
    el.find('nav.toolbar a').attr('href', '/explore/' + doc.id);
    container.append(el);
  })

  // update counters after render
  this.init();
  this.fetch();
}

/**
 *  Render the star counters.
 */
function render(doc) {
  var ids = Object.keys(doc);
  ids.forEach(function(id) {
    var el = $('.quotation[data-id="' + id + '"]')
      , txt = el.find('a.star span');
    if(!txt.length) {
      el.find('a.star').append($.create('span'));
    }
    if(doc[id]) {
      el.find('a.star span').addClass('star').text('' + doc[id]);
    }
  })
}

/**
 *  Loads the star counters for all quotes.
 */
function fetch(ids) {
  var scope = this;
  if(!ids) {
    ids = [];
    this.quotes.each(function(el) {
      ids.push($(el).data('id'));
    })
  }

  // no elements on page
  if(!ids.length) {
    return; 
  }

  function onResponse(err, res) {
    var doc;
    if(err) {
      return console.error(err); 
    }else if(res) {
      doc = JSON.parse(res); 
    }
    scope.render(doc);
  }
  var opts = {
    url: this.opts.api + '/quote/star',
    method: 'POST',
    json: true,
    body: ids
  };

  $.request(opts, onResponse.bind(this));
}

[
  count, add, init, remove, list, totals, listing,
  read, write, has, fetch, render].forEach(function(m) {
  Star.prototype[m.name] = m;
});

module.exports = Star;

},{"air":"air"}],"air":[function(require,module,exports){
module.exports = require('./lib/air');

},{"./lib/air":1}]},{},[32]);
