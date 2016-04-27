(function () {
  'use strict';

  var emitter = require('./mediator');
  var _ = require('./util');
  var data = require('./data');
  var map = require('./map');
  var autocomplete = require('./autocomplete');

  data.init();

  emitter.on('refuges', function (refuges) {

    map.init({
      data: refuges
    });

    autocomplete.init({
      data: refuges,
      input: document.querySelector('.map-autocomplete'),
      list: document.querySelector('.autocomplete-results')
    });

  });

})();
