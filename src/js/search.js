(function () {
  'use strict';

  var lunr = require('lunr');

  var _ = require('./util');

  var index, opts;

  function init(options) {
    opts = _.defaults({}, options);
    createIndex();
  }

  function getAll() {
    return opts.data.features.sort(sortByName);
  }

  function createIndex() {
    index = lunr(function () {
      this.field('ORGNAME', { boost: 10 });
      this.field('ZIPCODE');
      this.field('CITY');
      this.field('STATE');
      this.ref('ORGCODE');
    });
    _.each(opts.data.features, function(refuge) {
      index.add(refuge.properties);
    });
  }

  function search(term) {
    var filtered = [];
    var results = index.search(term);
    _.each(results, function(result) {
      _.each(opts.data.features, function (refuge) {
        refuge.score = result.score;
        if (refuge.properties.ORGCODE === result.ref) filtered.push(refuge);
      });
    });
    filtered.sort(sortByScore);
    return filtered;
  }

  function sortByScore(a,b) {
    if (a.score < b.score) return -1;
    else if (a.score > b.score) return 1;
    else return 0;
  }

  function sortByName(a,b) {
    if (a.properties.ORGNAME < b.properties.ORGNAME) return -1;
    else if (a.properties.ORGNAME > b.properties.ORGNAME) return 1;
    else return 0;
  }

  module.exports.init = init;
  module.exports.search = search;
  module.exports.getAll = getAll;
})();
