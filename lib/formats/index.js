var fs = require('fs')
  , path = require('path')
  , jade = require('jade')
  , list = ['md', 'txt', 'pdf', 'html', 'json', 'xml']
  , templates = path.normalize(__dirname + '/../../www/src/download')
  , styles = '' + fs.readFileSync(
    __dirname + '/../../www/public/assets/css/standalone.css')
  , map = {}
  , mime = {
    // assuming IETF ratifies text/markdown for the moment
    md: 'text/markdown',
    txt: 'text/plain',
    pdf: 'application/pdf',
    html: 'text/html',
    json: 'application/json',
    xml: 'text/xml'
  }

list.forEach(function(ext) {
  map[ext] = require('./' + ext);
})

/**
 *  Compile a jade template.
 */
function template(tpl, info, cb) {
  fs.readFile(tpl, {encoding: 'utf8'}, function(err, buf) {
    if(err) {
      return cb(err); 
    }
    var opts = {filename: tpl}
      , func = jade.compile(buf.toString('utf8'), opts)
      , res = func(info.locals);
    cb(null, res);
  })
}

// async style compile, formats are sync but you never know
var compile = {
  json: function json(info, cb) {
    var res;
    try{
      res = JSON.stringify(info.doc); 
    }catch(e){
      return cb(e);
    }
    cb(null, res);
  },
  txt: function txt(info, cb) {
    var tpl = path.join(templates, 'txt.jade');
    info.locals = {doc: info.doc};
    template(tpl, info, cb);
  },
  md: function md(info, cb) {
    var tpl = path.join(templates, 'md.jade');
    info.locals = {doc: info.doc};
    template(tpl, info, cb);
  },
  html: function md(info, cb) {
    var tpl = path.join(templates, 'html.jade');
    info.locals = {doc: info.doc, styles: styles};
    template(tpl, info, cb);
  },
  pdf: require('./pdf')
}

/**
 *  Write the file to disc.
 */
function write(info, buf, cb) {
  var readable
    , writable
    , complete = false;
  //console.log('write: ' + info.filepath);
  //console.log('write: ' + buf);
  //

  function done(err) {
    if(complete) {
      return;
    }
    cb(err); 
    complete = true;
  }

  function onError(err) {
    done(err); 
  }

  function onEnd() {
    done();
  }

  if(typeof buf === 'object' && buf.stream) {
    readable = buf.stream; 
    writable = fs.createWriteStream(info.filepath);

    readable.on('error', onError);
    writable.on('error', onError);
    readable.on('end', onEnd);

    readable.pipe(writable);
  }else{

    fs.writeFile(info.filepath, buf, function onFileWrite(err) {
      if(err) {
        return cb(err);
      } 
      cb(null);
    })
  }
}

var info = {
  list: list,
  map: map,
  mime: mime,
  compile: compile,
  write: write
}

// constants
list.forEach(function(ext) {
  info[ext.toUpperCase()] = ext;
});

module.exports = info;
