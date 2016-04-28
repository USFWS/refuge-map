(function () {
  'use strict';

  var leaflet = require('leaflet');
  require('leaflet.markercluster');
  L.Icon.Default.imagePath = './images';

  var emitter = require('./mediator');
  var _ = require('./util');

  var map, opts, cluster;

  var defaults = {
    active: true,
    container: document.getElementById('map')
  };

  var template = require('../templates/popup.hbs');
  var blueGoose = L.icon({
    iconUrl: './images/blue-goose.svg',
    iconSize: [70, 90],
    popupAnchor: [5, -20]
  });

  function init(options) {
    opts = _.defaults({}, options, defaults);
    if (opts.active) show();

    map = L.map('map',{
      zoomControl: false
    }).setView([38.126, -96.637], 4);

    new L.Control.Zoom({ position: 'bottomright' }).addTo(map);
    addBasemap();
    addRefuges(opts.data);
    registerHanlders();
  }

  function registerHanlders() {
    emitter.on('selected:office', zoomToOffice);
    emitter.on('toggle:view', toggleView);
  }

  function toggleView(button) {
    if (opts.active) hide();
    else show(button);
  }

  function show(button) {
    opts.active = true;
    _.addClass(opts.container, 'active');
    if (button) button.textContent = 'View a List of Refuges';
  }

  function hide() {
    opts.active = false;
    _.removeClass(opts.container, 'active');
  }

  function addBasemap() {
    L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/{type}/{z}/{x}/{y}.{ext}', {
    	type: 'map',
    	ext: 'jpg',
    	attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    	subdomains: '1234'
    }).addTo(map);
  }

  function zoomToOffice(name) {
    var office = findRefugeByName(name);
    var coords = _.clone(office.geometry.coordinates);
    map.flyTo(coords.reverse(), 12);
  }

  function findRefugeByName(name) {
    var offices = _.filter(opts.data.features, function (refuge) {
      return refuge.properties.ORGNAME.toLowerCase() === name.toLowerCase();
    });
    return offices[0];
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
      onEachFeature: createPopup,
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
