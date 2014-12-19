/** @jsx React.DOM */

'use strict';

var React = require('react/addons');
var Backbone = require('backbone');
var Firebase = require('firebase');
var $ = require('jquery');
var _ = require('underscore');
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

    this.firebase = new Firebase("https://flickering-heat-5281.firebaseio.com/");
    this.firebase.child('data').once('value', function(snapshot) {
      var data = snapshot.val();
      var features = _.filter(data.features, function(feature) {
        return feature.geometry.type === 'Point' || feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon'
      });
      this.setState({
        data: new Backbone.Collection((function() {
          return _.map(features, function(e) {
            return {
              type: e.geometry,
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
