/** @jsx React.DOM */

'use strict';

var React = require('react');
var _ = require('underscore');
var Howler = require('howler');

var MapStore = require('../stores/MapStore');
var Timer = require('./Timer');

var Prompt = React.createClass({

  getInitialState: function(props) {
    props = props || this.props;
    return {
      data: props.data,
      model: _.sample(props.data.models)
    };
  },

  componentWillReceiveProps: function(newProps, oldProps) {
    this.setState(this.getInitialState(newProps));
  },

  _handleNext: function (e) {
    if (this.state.model.get('name') === e.name) {
      this.state.data.remove(this.state.model);
      this.componentWillReceiveProps({
        data: this.state.data
      });
      e.setMap(null);
      new Howler.Howl({
        urls: ['sfx/correct.mp3']
      }).play();
      return;
    }
    new Howler.Howl({
      urls: ['sfx/boo.wav']
    }).play();
    this.setState({
      'wrong': true
    });
    _.delay(function() {
      this.setState({
        'wrong': false
      });
    }.bind(this), 1000);
  },

  componentDidMount: function () {
    MapStore.addChangeListener(this._handleNext);
  },

  render: function () {
    var prompt;

    if (this.state.wrong) {
      prompt = "Nope!";
    } else if (this.state.model) {
      var tpl = _.template("Where Is <%= name %>?");
      prompt = tpl({name: this.state.model.get('name')});
    } else {
      prompt = "All Done!";
    }

    return (
      <div className={this.state.wrong ? 'wrong' : ''}>
        <span>{prompt}</span>
        <Timer />
      </div>
    );
  }
});

module.exports = Prompt;
