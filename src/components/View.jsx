/** @jsx React.DOM */

'use strict';

var React = require('react/addons');
var BackboneMixin = require('backbone-react-component');
var ReactGoogleMaps = require('react-googlemaps');
var _ = require('underscore');
var proj4 = require('proj4');

proj4.defs("EPSG:3112","+proj=lcc +lat_1=-18 +lat_2=-36 +lat_0=0 +lon_0=134 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
proj4.defs('WGS84', "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees");

var Actions = require('../actions/Actions');
var MapStore = require('../stores/MapStore');
var City = require('./City');

var GoogleMaps = window.google.maps;
var ReactMap = ReactGoogleMaps.Map;
var Marker = ReactGoogleMaps.Marker;
var Polygon = ReactGoogleMaps.Polygon;
var LatLng = GoogleMaps.LatLng;

var View = React.createClass({
  mixins: [BackboneMixin],

  createEntry: function (entry) {
    if (!entry.type) {
      return;
    }
    switch (entry.type.type) {
      case 'Point':
        var point = proj4('EPSG:3112', 'WGS84', [
          entry.type.coordinates[0],
          entry.type.coordinates[1]
        ]);
        return <Marker
          onClick={this.handleSelect.bind(null, entry.name)}
          animation={GoogleMaps.Animation.DROP}
          icon="pin.png"
          key={entry.name}
          position={new LatLng(point[1], point[0])} />
        case 'Polygon':

          var blueCoords = [];
          _.each(entry.type.coordinates, function(c) {
          blueCoords.push(_.map(c, function(e) {
            var point = proj4('EPSG:3112', 'WGS84', [
              e[0],
              e[1]
            ]);
            return new LatLng(point[1], point[0]);
          }));
        });

      return (
        <span>
        <Polygon
          initialPaths={blueCoords}
          strokeColor="#0000FF"
          strokeOpacity={0.8}
          strokeWeight={2}
          fillColor="#0000FF"
          fillOpacity={0.35}
          draggable
          geodesic />

          <Polygon
            initialPaths={blueCoords}
            strokeColor="#0000FF"
            strokeOpacity={0.8}
            strokeWeight={2}
            fillColor="#0000FF"
            fillOpacity={0.35}
            draggable
            geodesic />
        </span>
      );
    }
  },

  componentDidMount: function () {
    MapStore.addChangeListener(this._handleSelection);
  },

  getInitialState: function() {
    return {
      center: new LatLng(-30.3080, 132.1245)
    };
  },

  _handleSelection: function (e) {
  },

  handleSelect: function(name, i, e) {
    _.extend(e, {
      'name': name
    });
    Actions.handleSelection(e);
  },

  render: function () {
    return <ReactMap
       initialZoom={5}
       initialCenter={this.state.center}
       disableDefaultUI={true}
       disableDoubleClickZoom={true}
       draggable={false}
       mapTypeId={GoogleMaps.MapTypeId.TERRAIN}
       styles={require('./styles')}
       width="100%"
       height="900px">
        {this.props.collection.map(this.createEntry)}
     </ReactMap>
  }
});

module.exports = View;
