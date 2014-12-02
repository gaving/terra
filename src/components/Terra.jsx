/** @jsx React.DOM */

'use strict';

var React = require('react/addons');
var Backbone = require('backbone');
var Firebase = require('firebase');
var $ = require('jquery');
var _ = require('underscore');
var proj4 = require('proj4');
var Howler = require('howler');
var Faker = require('faker');

var Prompt = require('./Prompt');
var View = require('./View');
var Leaderboard = require('./Leaderboard');

var Terra = React.createClass({
  componentWillMount: function() {
    new Howler.Howl({
      urls: ['sfx/terra.mp3']
    }).play();

    proj4.defs("EPSG:3112","+proj=lcc +lat_1=-18 +lat_2=-36 +lat_0=0 +lon_0=134 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
    proj4.defs('WGS84', "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees");

    this.firebase = new Firebase("https://flickering-heat-5281.firebaseio.com/");
    this.firebase.child('data').once('value', function(snapshot) {
      var data = snapshot.val();
      var features = _.filter(data.features, function(feature) {
        return feature.geometry.type === 'Point'
      });
      this.setState({
        data: new Backbone.Collection((function() {
          return _.map(features, function(e) {
            var point = proj4('EPSG:3112', 'WGS84', [
              e.geometry.coordinates[0],
              e.geometry.coordinates[1]
            ]);
            return {
              x: point[1],
              y: point[0],
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

  handleFinished: function(data) {
    var result = prompt("What is your name?", Faker.name.findName().replace('.', ''));
    if (result) {
      var scoreRef = this.firebase.child('scores').child(result);
      scoreRef.set(data.score);
    }
    this.firebase.child('scores').once('value', function(snapshot) {
      var data = snapshot.val();
      var collection = new Backbone.Collection((function() {
        var scores = [];
        for (var key in data) {
          scores.push({name: key, score: data[key]});
        }
        return _.sortBy(scores, function(o) {
          return o.score;
        })
      }()));
      React.render(<Leaderboard collection={collection} />, $("body")[0]);
    });
  },

  render: function() {
    return (
      <div>
        <section id="header">
          <Prompt collection={this.state.data} onFinished={this.handleFinished} />
        </section>
        <section id="main">
          <View collection={this.state.data} />
        </section>
      </div>
    );
  },
});

module.exports = Terra;
