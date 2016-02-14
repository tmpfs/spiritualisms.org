var $ = require('air')
  , error = require('./error')
  , unique = require('./unique')
  , Abstract = require('./abstract');

/**
 *  Encapsulates the logic for importing stars into the 
 *  local storage model.
 */
function Import() {
  Abstract.apply(this, arguments);

  this.reset();

  this.model = this.opts.model.star;

  var link = $('a.import');

  if(!window.FileList || !window.FileReader) {
    link.hide();
  }else{
    link.on('click', showDialog.bind(this));
  }
}

/**
 *  Show the import dialog.
 */ 
function showDialog() {
  var opts = {
    el: $.partial('.dialog.import'),
    remove: false,
    modal: false
  };
  this.dialog = $.dialog(opts, onDismiss.bind(this));
  var chooser = $('#chooser')
    , label = $('[for="chooser"]');
  chooser.on('change', change.bind(this));

  // drag drop handlers
  label.on('drop', drop.bind(this), false);
  label.on('dragover', dragOver, false);
  label.on('dragleave', dragLeave, false);
}

/**
 *  Handle drag over event.
 */
function dragOver(e) {
  e.stopPropagation();
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
  var el = $(e.currentTarget);
  el.addClass('dragover');
}

/**
 *  Handle drag leave event.
 */
function dragLeave(e) {
  e.stopPropagation();
  e.preventDefault();
  var el = $(e.currentTarget);
  el.removeClass('dragover');
}

/**
 *  Handle file drop event.
 */
function drop(e) {
  e.stopPropagation();
  e.preventDefault();
  this.load(e.dataTransfer.files);
}

/**
 *  Respond to the dialog event.
 */
function onDismiss(res) {

  var finish = (function done() {
    // reset state
    this.reset();
    // dismiss the dialog
    res.remove();
  }).bind(this);

  // user dismissed the dialog
  if(!res.accepted) {
    finish();
    return res.remove(); 
  }

  //console.log('perform import');
  //console.log(this.info);

  function onIncrement(/*err, res*/) {

    // update the list of model identifers
    var ids = this.model.read().concat(this.info.diff);
    this.model.write(ids);

    // redraw the list of starred quotes
    this.notifier.emit('stars/list');
    this.notifier.emit('stars/total');

    finish();
  }

  if(this.info.diff.length) {
    this.model.incr(this.info.diff, onIncrement.bind(this));
  }else{
    finish();
  }
}

/**
 *  Remove previous error messages.
 */
function removeErrors() {
  // dismiss any previous errors
  $('.choose .msg.error').remove();
}

/**
 *  Reset list of documents for another import.
 */
function reset() {
  this.info = {
    duplicates: [],
    missing: [],
    diff: []
  }

  this.documents = [];
}

/**
 *  Perform the import from the documents array.
 */
function process() {
  var doc = []
    , info = this.info
    , stars = this.model.read();

  // take all loaded documents and put them
  // in a single array
  this.documents.forEach(function(d) {
    doc = doc.concat(d);
  })

  // with unique entries
  //
  // can have multiple entries if the user
  // chooses the same document multiple times
  // one after the other, ie: select `stars.json`
  // select `other-stars.json` and then select
  // `stars.json` again
  doc = unique(doc);

  // check for duplicate identifiers
  doc.forEach(function(id) {
    if(~stars.indexOf(id)) {
      return info.duplicates.push(id); 
    } 
    info.diff.push(id);
  })

  function onFilter(err, res) {
    // NOTE: errors currently handled by model
    // NOTE: however follow idiomatic signature

    // array of identifiers that are valid (exist in the db)
    var exists = res.body
      , id
      , i;

    // remove bad identifiers from the diff and 
    // add them to the missing info array
    for(i = 0;i < info.diff.length;i++) {
      id = info.diff[i];
      if(!~exists.indexOf(id)) {
        info.missing.push(id);
        info.diff.splice(i, 1); 
        i--;
      }
    }
  
    this.summary(this.info);
  }

  // check for missing quotes (bad quote identifiers)
  this.opts.model.quote.filter(info.diff, onFilter.bind(this));
}

/**
 *  Show the processing summary.
 */
function summary(info) {
  var list = $.el('ul')
    , link = $('[href="#ok"]');

  list.addClass('summary');

  // clean any previous summary
  $('.choose').find('ul.summary').remove();

  if(info.missing.length) {
    list.append($.el('li').text(
      info.missing.length + ' stars missing').addClass('missing'));
  }

  if(info.duplicates.length) {
    list.append($.el('li').text(
      info.duplicates.length + ' duplicate stars').addClass('duplicate'));
  }

  this.dialog.find('.choose').append(list);

  if(info.diff.length) {
    list.append($.el('li').text(
      info.diff.length + ' new stars').addClass('new'));
    link.text('Import ' + info.diff.length + ' stars');
  }else{
    link.text('Nothing to import!'); 
  }

  link.enable();
}

/**
 *  Handle file choose dialog change.
 */
function change(e) {
  e.preventDefault();
  var files = e.target.files
    , file = files[0];

  // user likely dismissed the choose file dialog
  if(!file) {
    return; 
  }

  this.load(files);
}

/**
 *  Displays the file names and loads the file contents.
 */
function load(files) {
  var i
    , file
    , list = $('ul.filenames');

  // show file name list
  for(i = 0;i < files.length;i++) {
    file = files.item(i); 
    list.append($.el('li').text(file.name));
  }

  this.each(files);
}

/**
 *  Iterate and read all files.
 */
function each(files, index) {
  index = index || 0;
  var file = files[index];

  function onRead(err, doc) {
    if(err) {
      removeErrors();
      return error(err.message, this.dialog.find('.choose'));
    } 

    removeErrors();
    this.documents.push(doc);

    // keep iterating
    if(index < (files.length - 1)) {
      return this.each(files, ++index);
    }

    this.process();
  }

  read(file, onRead.bind(this));
}

/**
 *  Read the file content as text.
 */
function read(file, cb) {
  var reader = new FileReader();
  reader.onerror = function(err) {
    cb(err);
  }

  reader.onload = function() {
    var doc;
    try {
      doc = JSON.parse(this.result); 
    }catch(e) {
      return cb(new Error(
        'Cannot import document, invalid JSON.'));
    }

    if(!Array.isArray(doc)) {
      return cb(new Error(
        'Cannot import document, expected JSON array.'));
    }

    for(var i = 0;i < doc.length;i++) {
      if(typeof doc[i] !== 'string') {
        return cb(new Error(
          'Cannot import document, expected array of strings.'));
      } 
    }
    cb(null, doc);
  }
  reader.readAsText(file);
}

Import.prototype.process = process;

[process, summary, reset, load, each].forEach(function(m) {
  Import.prototype[m.name] = m;
});

module.exports = Import;
