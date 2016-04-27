(function () {
  'use strict';

  var mkdirp = require('mkdirp');

  var directories = ['dist/js', 'dist/css', 'dist/fonts', 'dist/images'];

  directories.forEach(function (path) {
    mkdirp(path, function (err) {
      if (err) console.error(err);
    });
  });
})();
