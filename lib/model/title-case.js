/**
 *  Convert words in a string to title case.
 */
function titleCase(str) {
  var parts = str.split(/\s+/);
  return parts.map(function(word) {
    // initials, ie: B.K.S
    if(/^([a-z]\.)+$/.test(word)) {
      return word.toUpperCase(); 
    }
    return word
      ? word.substr(0,1).toUpperCase() + word.substr(1) : word;
  }).join(' ');
}

module.exports = titleCase;
