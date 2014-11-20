/** @jsx React.DOM */

'use strict';

var React = require('react/addons');
var Backbone = require('backbone');
var Firebase = require('firebase');
var converter = require('coordinator');
var _ = require('underscore');

var Prompt = require('./Prompt');
var View = require('./View');

var Terra = React.createClass({
  componentWillMount: function() {
    var firebase = new Firebase("https://flickering-heat-5281.firebaseio.com/data");
    firebase.once('value', function(snapshot) {
      var data = snapshot.val();
      var features = _.filter(data.features, function(feature) {
        return feature.geometry.type === 'Point'
      });
      var fn = converter('utm', 'latlong');
      this.setState({
        data: new Backbone.Collection((function() {
          return _.map(features, function(e) {
            var point = fn(e.geometry.coordinates[1], e.geometry.coordinates[0], 53);
            return {
              x: point.latitude,
              y: point.longitude,
              name: e.properties.name
            }
          })
        })())
      });
    }.bind(this));
  },

  getInitialState: function() {
    return {
      data: new Backbone.Collection({})
    };
  },

  render: function() {
    return (
      <div>
        <section id="header">
          <Prompt data={this.state.data} />
        </section>
        <section id="main">
          <View collection={this.state.data} />
        </section>
      </div>
    );
  },
});

module.exports = Terra;
