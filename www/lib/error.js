var $ = require('air')
  , dismiss = require('./dismiss');

/**
 *  Show an error message to the user.
 */
function error(msg, target) {
  target = target || $('section');
  var err = $.partial('.msg.error').clone(true);
  err.find('p').text(msg);
  target.prepend(err).fadeIn();
  dismiss();
}

module.exports = error;
