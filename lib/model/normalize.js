/**
 *  Normalize a quote document.
 */
function normalize(body) {
  body.id = body._id;
  delete body._id;
  delete body._rev;
  delete body.type;
  delete body.random;
  delete body.publish;
}

module.exports = normalize;
