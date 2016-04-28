(function () {
  'use strict';

  var lunr = require('./search');

  var emitter = require('./mediator');
  var _ = require('./util');
  var template = require('../templates/search-result.hbs');

  var defaults = {
    minLength: 2
  };

  var opts, index;

  function init(options) {
    opts = _.defaults({}, options, defaults);
    registerHandlers();
  }

  function registerHandlers() {
    opts.input.addEventListener('keyup', findRefuges);
    opts.list.addEventListener('click', selectOffice);
  }

  function selectOffice(e) {
    var refugeName;
    e.preventDefault();
    if (e.target.nodeName == 'A') {
      refugeName = e.target.textContent;
      opts.input.value = refugeName;
      window.location.hash = _.slugify(refugeName);
      opts.list.innerHTML = '';
      emitter.emit('selected:office', refugeName);
    }
  }

  function findRefuges(e) {
    var term = opts.input.value;
    if (term.length === 0) opts.list.innerHTML = '';
    if (term.length <= opts.minLength) return;
    render(lunr.search(term));
  }

  function render(data) {
    _.each(data, function (refuge) {
      refuge.properties.slug = _.slugify(refuge.properties.ORGNAME);
    });
    opts.list.innerHTML = template(data);
  }

  module.exports.init = init;
})();
