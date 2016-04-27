(function () {
  'use strict';

  var lunr = require('lunr');

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
    createIndex();
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
      emitter.emit('selected:office', findRefugeByName(refugeName) );
    }
  }

  function findRefugeByName(name) {
    var offices = _.filter(opts.data.features, function (refuge) {
      return refuge.properties.ORGNAME.toLowerCase() === name.toLowerCase();
    });
    return offices[0];
  }

  function findRefuges(e) {
    var term = opts.input.value;
    if (term.length === 0) opts.list.innerHTML = '';
    if (term.length <= opts.minLength) return;
    render(searchIndex(term));
  }

  function render(data) {
    _.each(data, function (refuge) {
      refuge.properties.slug = _.slugify(refuge.properties.ORGNAME);
    });
    opts.list.innerHTML = template(data);
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
      var props = refuge.properties;
      index.add({
        "ORGCODE": props.ORGCODE,
        "ORGNAME": props.ORGNAME,
        "CITY": props.CITY,
        "STATE": props.STATE,
        "ZIP": props.ZIP
      });
    });
  }

  function searchIndex(term) {
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
    if (a.score < b.score)
      return -1;
    else if (a.score > b.score)
      return 1;
    else
      return 0;
  }

  module.exports.init = init;
})();
