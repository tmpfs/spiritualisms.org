var $ = require('air')
  , error = require('./error')
  , dialog = require('./dialog')
  , Abstract = require('./abstract');

function Import() {
  Abstract.apply(this, arguments);

  var link = $('a.import');

  if(!window.FileList || !window.FileReader) {
    link.hide();
  }else{
    link.on('click', function() {
      var opts = {
        el: $.partial('.dialog.import'),
        remove: false,
        modal: false
      };
      this.dialog = dialog(opts, onDismiss.bind(this));
      var chooser = $('#chooser');
      chooser.on('change', change.bind(this));
    })
  }
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
  console.log(res);
}

/**
 *  Update label on chosen file.
 */
function change(e) {
  e.preventDefault();
  var files = e.target.files
    , file = files[0];
  $('.filename').show().text(file.name);
  console.log('choose file: ' + file.name);

  function onRead(err, doc) {
    if(err) {
      return error(e.message);
    } 

    // ok, enable 

    console.log(doc);
  }

  read(file, onRead);
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
  }
  reader.readAsText(file);
}

/**
 *  Load a JSON document and import into the local storage.
 */
//function load(e) {
  //e.preventDefault();
  //console.log('load file');
  //var files = e.target.files
    //, file = files[0];
  //var reader = new FileReader();
  //reader.onload = function() {
    //var doc;
    //try {
      //doc = JSON.parse(this.result); 
    //}catch(e) {
      //return error('Cannot import document, invalid JSON.');
    //}

    //if(!Array.isArray(doc)) {
      //return error('Cannot import document, expected JSON array.');
    //}

    //for(var i = 0;i < doc.length;i++) {
      //if(typeof doc[i] !== 'string') {
        //return error('Cannot import document, expected array of strings.');
      //} 
    //}

    //// TODO: implement import
    //console.log(doc);
  //}
  //reader.readAsText(file);
//}


module.exports = Import;
