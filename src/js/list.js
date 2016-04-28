(function () {
  'use strict';

  var lunr = require('./search');
  var _ = require('./util');
  var emitter = require('./mediator');

  var template = require('../templates/list.hbs');

  var opts;

  var defaults = {
    active: false,
    container: document.querySelector('.text-list')
  };

  function init(options) {
     opts = _.defaults({}, options, defaults);
     if (opts.active) show();
     render(lunr.getAll());
     registerHandlers();
  }

  function registerHandlers() {
    opts.input.addEventListener('keyup', search);
    emitter.on('toggle:view', toggleView);
  }

  function toggleView(button) {
    if (opts.active) hide();
    else show(button);
  }

  function hide() {
    opts.active = false;
    _.removeClass(opts.container, 'active');
  }

  function show(button) {
    opts.active = true;
    _.addClass(opts.container, 'active');
    if (button) button.textContent = 'View a Map of Refuges';
  }

  function search() {
    var term = opts.input.value;
    if (term.length === 0) render(lunr.getAll());
    else render(lunr.search(term));
  }

  function render(data) {
    opts.list.innerHTML = template(data);
  }

  module.exports.init = init;
})();
