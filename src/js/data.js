(function () {
  'use strict';

  var xhr = require('xhr');
  var emitter = require('./mediator');
  var _ = require('./util');

  var url = "http://services.arcgis.com/QVENGdaPbd4LUkLV/ArcGIS/rest/services/FWSVisitorServices/FeatureServer/0/query?where=OBJECTID+%3E+-1&outFields=*&f=pgeojson";

  function init() {
    xhr.get(url, function(err, res, body) {
      var offices = JSON.parse(body);
      var refuges = _filter(offices, 'ORGNAME','National Wildlife Refuge');
      emitter.emit('refuges', refuges);
    });
  }

  function _filter(list, field, term) {
    list.features = _.filter(list.features, function (office) {
      return office.properties[field].indexOf(term) > -1;
    });
    return list;
  }

  module.exports.init = init;
})();
