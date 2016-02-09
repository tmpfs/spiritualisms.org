var $ = require('air')
  , error = require('./error')
  , dialog = require('./dialog')
  , Abstract = require('./abstract');

function Import() {
  Abstract.apply(this, arguments);

  // store the documents to import
  this.documents = [];

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
  var doc = [];
  this.documents.forEach(function(d) {
    doc = doc.concat(d);
  })
  console.log('process import');
  console.log(doc);
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
    console.log('file read completed');
    if(err) {
      removeErrors();
      return error(err.message, this.dialog.find('.choose'));
    } 

    // ok, enable 
    removeErrors();
    //$('[href="#ok"]').enable();
    //
    console.log(this.documents);

    this.documents.push(doc);
    this.process();
  }

  console.log('call read: ' + this.documents);

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

module.exports = Import;
