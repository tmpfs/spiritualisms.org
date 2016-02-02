require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
  type: 'object',
  fields: {
    type: {type: 'string', required: true},
    publish: {type: 'boolean'},
    quote: {type: 'string', required: true},
    author: {type: 'string', required: true},
    link: [
      {type: 'string'}
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

},{}],2:[function(require,module,exports){
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

},{"zephyr":4}],3:[function(require,module,exports){
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
      evt = document.createEvent('HTMLEvents');
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{"../messages":9,"./reason":6,"format-util":10,"zephyr":11}],8:[function(require,module,exports){
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

},{"../messages":9,"./iterator":5,"./rule":7,"format-util":10}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"dup":4}],12:[function(require,module,exports){
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
    //require('air/css'),
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
  opts = opts || {};
  this.opts = opts;
  this.validator = new Schema(descriptor);
  $('a.more-inspiration').on('click', more.bind(this));
  console.log(opts.api);
  console.log($('body').length);
}

function more() {
  console.log('more called');
}

module.exports = Application;

},{"../../lib/schema/quote":1,"air":"air","air/event":3,"async-validate":8}],13:[function(require,module,exports){
/* jshint ignore:start */
var Application = require('./app');
module.exports = new Application(window.app);
/* jshint ignore:end */

},{"./app":12}],"air":[function(require,module,exports){
module.exports = require('./lib/air');

},{"./lib/air":2}]},{},[13]);
