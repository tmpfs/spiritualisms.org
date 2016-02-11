var util = require('util')
  , AbstractModel = require('./abstract')
  , sort = require('./sort')
  , titleCase = require('./title-case')
  , normalize = require('./normalize');

/**
 *  Author model representation.
 */
function Author() {
  AbstractModel.apply(this, arguments);
  this.name = 'authors';
}

util.inherits(Author, AbstractModel);

/**
 *  Find quotes by authors.
 */
function findByAuthors(opts, cb) {
  opts = opts || {};
  opts.ddoc = this.ddoc;
  opts.name = this.name;
  opts.qs = {
    limit: opts.limit !== undefined ? opts.limit : 50,
    reduce: typeof(opts.reduce) === 'boolean'
      ? opts.reduce : false,
    include_docs: typeof(opts.include_docs) === 'boolean'
      ? opts.include_docs : true,
    descending: opts.descending !== undefined ? opts.descending : true,
    keys: opts.keys
  }

  if(opts.limit === null) {
    delete opts.qs.limit; 
  }

  var server = this.server(opts);
  server.design.view(opts, function(err, res, body) {
    if(err) {
      return cb(err); 
    }
    if(!opts.qs.reduce && opts.qs.include_docs) {
      body.rows.forEach(function(row) {
        normalize(row.doc); 
      })
    }
    cb(null, res, body);
  });
}

/**
 *  Get all authors.
 *
 *  Returns a unique list of authors to tag frequency.
 */
function getAllAuthors(opts, cb) {
  opts = opts || {};
  opts.ddoc = this.ddoc;
  opts.name = this.name;

  opts.qs = {
    limit: opts.limit !== undefined ? opts.limit : 50,
    reduce: true,
    include_docs: false,
    group: true,
    descending: opts.descending !== undefined ? opts.descending : true,
  }

  if(opts.limit === null) {
    delete opts.qs.limit; 
  }

  var server = this.server(opts);
  server.design.view(opts, function(err, res, body) {
    if(err) {
      return cb(err); 
    }

    if(opts.normalize !== false) {
      body.rows = normalizeAuthors(body.rows);
    }

    if(opts.sort !== false) {
      body.rows = sort(body.rows); 
    }

    cb(null, res, body);
  });
}

/**
 *  Normalize tags.
 *
 *  Adds a title field with the key as title case.
 */
function normalizeAuthors(rows) {
  return rows.map(function(row) {
    row.title = titleCase(row.key);
    return row;
  })
}

Author.titleCase = titleCase;

Author.prototype.findByAuthors = findByAuthors;
Author.prototype.getAllAuthors = getAllAuthors;

module.exports = Author;
