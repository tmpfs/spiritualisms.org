var util = require('util')
  , AbstractModel = require('./abstract')
  , normalize = require('./normalize');

/**
 *  Tag model representation.
 */
function Tag() {
  AbstractModel.apply(this, arguments);
  this.name = 'tags';
}

util.inherits(Tag, AbstractModel);

/**
 *  Find quotes by tags.
 */
function findByTags(opts, cb) {
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
 *  Get all tags.
 *
 *  Returns a unique list of tags to tag frequency.
 */
function getAllTags(opts, cb) {
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
      body.rows = normalizeTags(body.rows);
    }

    if(opts.sort !== false) {
      body.rows = sortTags(body.rows); 
    }

    cb(null, res, body);
  });
}

/**
 *  Normalize tags.
 *
 *  Adds a title field with the key as title case.
 */
function normalizeTags(rows) {
  return rows.map(function(row) {
    row.title = row.key
      ? row.key.substr(0,1).toUpperCase() + row.key.substr(1) : row.key;
    return row;
  })
}

/**
 *  Sort the tag list.
 */
function sortTags(rows) {
  return rows.sort(function(a, b) {
    if(a.key === b.key) {
      return 0; 
    }
    return (a.key > b.key) ? 1 : -1;
  })
}

/**
 *  Takes a documents array of tags and converts them to the 
 *  {key: tag, title: title} format.
 */
function convert(tags) {
  tags = tags || [];
  tags = tags.map(function(tag) {
    return {key: tag};
  })
  tags = normalizeTags(tags);
  tags = sortTags(tags);
  return {rows: tags};
}

Tag.convert = convert;

Tag.prototype.findByTags = findByTags;
Tag.prototype.getAllTags = getAllTags;

module.exports = Tag;
