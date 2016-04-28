(function () {
  'use strict';

  var emitter = require('./mediator');
  var _ = require('./util');

  var data = require('./data');

  var map = require('./map');
  var autocomplete = require('./autocomplete');
  var list = require('./list');
  var search = require('./search');

  var toggle = document.querySelector('.toggle-view');

  toggle.addEventListener('click', toggleView);

  function toggleView() {
    emitter.emit('toggle:view', toggle);
  }

  data.init();

  emitter.on('refuges', function (refuges) {

    search.init({
      data: refuges
    });

    list.init({
      input: document.querySelector('.text-list-search'),
      list: document.querySelector('.refuge-list')
    });

    map.init({
      data: refuges
    });

    autocomplete.init({
      input: document.querySelector('.map-autocomplete'),
      list: document.querySelector('.autocomplete-results')
    });

  });

})();
