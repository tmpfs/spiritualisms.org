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

/**
 *  Represents the local storage model for user's stars.
 */
function StarModel(opts) {
  opts = opts || {};
  this.storage = storageAvailable('localStorage');
  this.key = opts.key || 'stars';
  this.file = opts.file || 'stars.json';
}

/**
 *  Save the array of identifiers as a file to disc.
 */
function save() {
  var blob = new Blob(
    [JSON.stringify(this.read(), undefined, 2)], {type: 'application/json'});
  // requires file-saver.js to be loaded
  window.saveAs(blob, this.file, true);
}

/**
 *  Read the identifier array from local storage.
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
 *  Add an identifier to the array.
 */
function add(id) {
  var ids = this.read();
  if(!~ids.indexOf(id)) {
    ids.push(id); 
    this.write(ids);
  }
  return ids;
}

/**
 *  Remove an identifier from the array.
 */
function del(id) {
  var ids = this.read()
    , ind = ids.indexOf(id);
  if(~ind) {
    ids.splice(ind, 1);
    this.write(ids);
  }
  return ids;
}

/**
 *  Delete all identifiers from the array.
 */
function clear() {
  localStorage.removeItem(this.key);
}

/**
 *  Write an array of identifiers to local storage.
 */
function write(ids) {
  ids = ids || [];
  localStorage.setItem(this.key, JSON.stringify(ids));
}

/**
 *  Determine if an identifier already exists.
 */
function has(id) {
  var ids = this.read();
  return Boolean(~ids.indexOf(id));
}

/**
 *  Count the number of stars for this user.
 */
function length() {
  var ids = this.read();
  return ids.length;
}

[save, read, write, add, del, has, clear, length].forEach(function(m) {
  StarModel.prototype[m.name] = m;
});

module.exports = StarModel;
