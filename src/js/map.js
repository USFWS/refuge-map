(function () {
  'use strict';

  var leaflet = require('leaflet');
  require('leaflet.markercluster');
  L.Icon.Default.imagePath = './images';

  var emitter = require('./mediator');
  var _ = require('./util');

  var blueGoose = L.icon({
    iconUrl: './images/blue-goose.svg',
    iconSize: [70, 90],
    popupAnchor: [5, -20]
  });

  var map, options, cluster;
  var template = require('../templates/popup.hbs');

  function init(opts) {
    map = L.map('map',{
      zoomControl: false
    }).setView([38.126, -96.637], 4);

    new L.Control.Zoom({ position: 'bottomright' }).addTo(map);
    addBasemap();
    addRefuges(opts.data);
    emitter.on('selected:office', zoomToOffice);
  }

  function addBasemap() {
    L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/{type}/{z}/{x}/{y}.{ext}', {
    	type: 'map',
    	ext: 'jpg',
    	attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    	subdomains: '1234'
    }).addTo(map);
  }

  function zoomToOffice(office) {
    var coords = _.clone(office.geometry.coordinates);
    map.flyTo(coords.reverse(), 12);
  }

  function addRefuges(refuges) {
    var markers = L.geoJson(refuges, {
      onEachFeature: createPopup,
      pointToLayer: customIcon,
      filter: function(feature) {
        return feature.properties.ORGNAME !== 'Guam National Wildlife Refuge';
      }
    });

    var guam = L.geoJson(refuges, {
      pointToLayer: customIcon,
      filter: function(feature) {
        return feature.properties.ORGNAME === 'Guam National Wildlife Refuge';
      }
    }).addTo(map);

    cluster = L.markerClusterGroup({
      showCoverageOnHover: false
    });

    cluster.addLayer(markers).addTo(map);
    map.fitBounds(cluster.getBounds());
  }

  function createPopup(feature, layer) {
    layer.bindPopup(template({ refuge: feature.properties }));
  }

  function customIcon(feature, latlng) {
    return L.marker(latlng, { icon: blueGoose });
  }

  module.exports.init = init;
})();
