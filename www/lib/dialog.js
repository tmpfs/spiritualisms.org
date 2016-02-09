var $ = require('air');

function dialog(opts, cb) {
  var el = opts.el.clone(true)
    , container = opts.container || $('body')
    , res = {accepted: false, el: el};

  // pass function to remove element in result
  // when we don't handle removing
  if(opts.remove === false) {
    res.remove = function() {
      el.remove(); 
    }
  }

  container.append(el);

  function onReject(e) {
    e.preventDefault();
    if(opts.remove !== false) {
      el.remove();
    }
    cb(res);
  }

  function onAccept(e) {
    e.preventDefault();
    if(opts.remove !== false) {
      el.remove();
    }
    res.accepted = true;
    cb(res);
  }

  var modal = el.find('.modal');
  if(opts.modal !== false) {
    modal.on('click', onReject);
  }else{
    modal.css({cursor: 'auto'})
  }
  el.find('[href="#cancel"]').on('click', onReject);
  el.find('[href="#ok"]').on('click', onAccept);

  return el;
}

module.exports = dialog;
