var $ = require('air')
  , error = require('./error')
  , dialog = require('./dialog')
  , Abstract = require('./abstract');

function Import() {
  Abstract.apply(this, arguments);

  // store the documents to import
  this.documents = [];

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
  this.dialog = dialog(opts, onDismiss.bind(this));
  var chooser = $('#chooser');
  chooser.on('change', change.bind(this));
}

/**
 *  Response to the dialog event.
 */
function onDismiss(res) {
  // user dismissed the dialog
  if(!res.accepted) {
    return res.remove(); 
  }

  console.log('perform import');
  console.log(this.documents);
}

/**
 *  Remove previous error messages.
 */
function removeErrors() {
  // dismiss any previous errors
  $('.choose .msg.error').remove();
}

/**
 *  Perform the import from the documents array.
 */
function process() {
  var doc = []
    , info = {
        duplicates: [],
        missing: [],
        diff: []
      }
    , stars = this.model.read();

  // take all loaded documents and put them
  // in a single array
  this.documents.forEach(function(d) {
    doc = doc.concat(d);
  })

  // check for duplicate identifiers
  this.documents.forEach(function(id) {
    if(~stars.indexOf(id)) {
      return info.duplicates.push(id); 
    } 
    info.diff.push(id);
  })

  // TODO: check for missing quotes (bad quote identifiers)

  console.log(info.diff);

  this.summary(info);

  // reset list of documents for another import
  this.documents = [];
}

/**
 *  Show the processing summary.
 */
function summary(info) {
  var list = $.el('ul')
    , link = $('[href="#ok"]');

  if(info.missing.length) {
    list.append($.el('li').text(
      info.missing.length + ' stars missing').addClass('missing'));
  }

  if(info.duplicates.length) {
    list.append($.el('li').text(
      info.duplicates.length + ' duplicate stars').addClass('duplicate'));
  }

  if(info.diff.length) {
    list.append($.el('li').text(
      info.diff.length + ' new stars').addClass('new'));
    this.dialog.find('.choose').append(list);
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

  $('.filename').show().text(file.name);

  function onRead(err, doc) {
    if(err) {
      removeErrors();
      return error(err.message, this.dialog.find('.choose'));
    } 

    // ok, enable 
    removeErrors();

    this.documents.push(doc);
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

[process, summary].forEach(function(m) {
  Import.prototype[m.name] = m;
});

module.exports = Import;
