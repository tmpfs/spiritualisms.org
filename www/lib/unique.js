function filter(value, index, self) { 
  return self.indexOf(value) === index;
}

function uniq(arr) {
  return arr.filter(filter);
}

module.exports = uniq;
