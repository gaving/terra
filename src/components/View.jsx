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
      center: new LatLng(-30.3080, 132.1245),
      data: []
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

    var style = [
      {"elementType":"labels.text",
        "stylers":[
          {"visibility":"off"}
        ]

    },
    {"featureType":"landscape.natural",
      "elementType":"geometry.fill",
      "stylers":[
        {"color":"#f5f5f2"},
        {"visibility":"on"}
      ]

    },
    {"featureType":"administrative",
      "stylers":[
        {"visibility":"off"}
      ]

    },
    {"featureType":"transit",
      "stylers":[
        {"visibility":"off"}
      ]

    },
    {"featureType":"poi.attraction",
      "stylers":[
        {"visibility":"off"}
      ]

    },
    {"featureType":"landscape.man_made",
      "elementType":"geometry.fill",
      "stylers":[
        {"color":"#ffffff"},
        {"visibility":"on"}
      ]

    },
    {"featureType":"poi.business",
      "stylers":[
        {"visibility":"off"}
      ]

    },
    {"featureType":"poi.medical",
      "stylers":[
        {"visibility":"off"}
      ]

    },
    {"featureType":"poi.place_of_worship",
      "stylers":[
        {"visibility":"off"}
      ]

    },
    {"featureType":"poi.school",
      "stylers":[
        {"visibility":"off"}
      ]

    },
    {"featureType":"poi.sports_complex",
      "stylers":[
        {"visibility":"off"}
      ]

    },
    {"featureType":"road.highway",
      "elementType":"geometry",
      "stylers":[
        {"color":"#ffffff"},
        {"visibility":"simplified"}
      ]

    },
    {"featureType":"road.arterial",
      "stylers":[
        {"visibility":"simplified"},
        {"color":"#ffffff"}
      ]

    },
    {"featureType":"road.highway",
      "elementType":"labels.icon",
      "stylers":[
        {"color":"#ffffff"},
        {"visibility":"off"}
      ]

    },
    {"featureType":"road.highway",
      "elementType":"labels.icon",
      "stylers":[
        {"visibility":"off"}
      ]

    },
    {"featureType":"road.arterial",
      "stylers":[
        {"color":"#ffffff"}
      ]

    },
    {"featureType":"road.local",
      "stylers":[
        {"color":"#ffffff"}
      ]

    },
    {"featureType":"poi.park",
      "elementType":"labels.icon",
      "stylers":[
        {"visibility":"off"}
      ]

    },
    {"featureType":"poi",
      "elementType":"labels.icon",
      "stylers":[
        {"visibility":"off"}
      ]

    },
    {"featureType":"water",
      "stylers":[
        {"color":"#71c8d4"}
      ]

    },
    {"featureType":"landscape",
      "stylers":[
        {"color":"#e5e8e7"}
      ]

    },
    {"featureType":"poi.park",
      "stylers":[
        {"color":"#8ba129"}
      ]

    },
    {"featureType":"road",
      "stylers":[
        {"color":"#ffffff"}
      ]

    },
    {"featureType":"poi.sports_complex",
      "elementType":"geometry",
      "stylers":[
        {"color":"#c7c7c7"},
        {"visibility":"off"}
      ]

    },
    {"featureType":"water",
      "stylers":[
        {"color":"#a0d3d3"}
      ]

    },
    {"featureType":"poi.park",
      "stylers":[
        {"color":"#91b65d"}
      ]

    },
    {"featureType":"poi.park",
      "stylers":[
        {"gamma":1.51}
      ]

    },
    {"featureType":"road.local",
      "stylers":[
        {"visibility":"off"}
      ]

    },
    {"featureType":"road.local",
      "elementType":"geometry",
      "stylers":[
        {"visibility":"on"}
      ]

    },
    {"featureType":"poi.government",
      "elementType":"geometry",
      "stylers":[
        {"visibility":"off"}
      ]

    },
    {"featureType":"landscape",
      "stylers":[
        {"visibility":"off"}
      ]

    },
    {"featureType":"road",
      "elementType":"labels",
      "stylers":[
        {"visibility":"off"}
      ]

    },
    {"featureType":"road.arterial",
      "elementType":"geometry",
      "stylers":[
        {"visibility":"simplified"}
      ]

    },
    {"featureType":"road.local",
      "stylers":[
        {"visibility":"simplified"}
      ]

    },
    {"featureType":"road"},
    {"featureType":"road"},
    {},
    {"featureType":"road.highway"}
    ];

    return <ReactMap
       initialZoom={5}
       initialCenter={this.state.center}
       disableDefaultUI={true}
       disableDoubleClickZoom={true}
       draggable={false}
       mapTypeId={GoogleMaps.MapTypeId.TERRAIN}
       styles={style}
       width="100%"
       height="900px">
        {this.props.collection.map(this.createEntry)}
     </ReactMap>
  }
});

module.exports = View;
