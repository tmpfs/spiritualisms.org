var $ = require('air');

function dialog(opts, cb) {
  var el = opts.el.clone(true)
    , container = opts.container || $('body')
    , res = {accepted: false};

  container.append(el);

  function onReject(e) {
    e.preventDefault();
    el.remove();
    cb(res);  
  }

  function onAccept(e) {
    e.preventDefault();
    el.remove();
    res.accepted = true;
    cb(res);  
  }

  el.find('.modal').on('click', onReject);
  el.find('[href="#cancel"]').on('click', onReject);
  el.find('[href="#ok"]').on('click', onAccept);
}

module.exports = dialog;
