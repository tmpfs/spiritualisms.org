var Writable = require('stream').Writable;

/**
 *  Buffer a stream so that we can determine content length.
 */
function buffer(stream, cb) {
  var buf = new Buffer(0);
  var writable = new Writable();
  //console.log(stream);
  writable._write = function(chunk, encoding, cb) {
    buf = Buffer.concat([buf, chunk], buf.length + chunk.length);
    cb();
  }
  writable.on('finish', function() {
    cb(null, buf);
  })
  writable.cork();
  stream.pipe(writable);
}

module.exports = buffer;
