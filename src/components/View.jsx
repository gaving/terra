/** @jsx React.DOM */

'use strict';

var React = require('react/addons');
var BackboneMixin = require('backbone-react-component');
var ReactGoogleMaps = require('react-googlemaps');
var _ = require('underscore');

var Actions = require('../actions/Actions');
var MapStore = require('../stores/MapStore');

var GoogleMaps = window.google.maps;
var ReactMap = ReactGoogleMaps.Map;
var Marker = ReactGoogleMaps.Marker;
var LatLng = GoogleMaps.LatLng;

var View = React.createClass({
  mixins: [BackboneMixin],

  createEntry: function (entry) {
    return <Marker
      onClick={this.handleSelect.bind(null, entry.name)}
      animation={GoogleMaps.Animation.DROP}
      icon="pin.png"
      key={entry.name}
      position={new LatLng(entry.x, entry.y)} />
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
