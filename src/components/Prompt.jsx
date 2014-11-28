/** @jsx React.DOM */

'use strict';

var React = require('react');
var BackboneMixin = require('backbone-react-component');
var _ = require('underscore');
var Howler = require('howler');

var MapStore = require('../stores/MapStore');
var Timer = require('./Timer');

var Prompt = React.createClass({
  mixins: [BackboneMixin],

  getInitialState: function(props) {
    props = props || this.props;
    return {
      collection: props.collection,
      model: _.sample(props.collection),
      status: 'loading'
    };
  },

  componentWillReceiveProps: function(newProps, oldProps) {
    this.setState(this.getInitialState(newProps));
  },

  _handleNext: function (e) {
    if (this.state.model.name === e.name) {
      this.componentWillReceiveProps({
        collection: _.without(this.state.collection, this.state.model)
      });
      e.setMap(null);
      new Howler.Howl({
        urls: ['sfx/correct.mp3']
      }).play();

      if (_.isEmpty(this.state.collection)) {
        this.done();
      }
      return;
    }
    this.setState({
      'status': 'wrong'
    }, function() {
      new Howler.Howl({
        urls: ['sfx/boo.wav']
      }).play();
      _.delay(function() {
        this.setState({
          'status': ''
        });
      }.bind(this), 1000);
    });
  },

  done: function() {
    this.setState({
      'status': 'done'
    }, function() {
      new Howler.Howl({
        urls: ['sfx/applause.mp3']
      }).play();
      this.props.onFinished({
        'score': this.refs.timer.getTime()
      });
      this.refs.timer.done();
    }.bind(this));
  },

  componentDidMount: function () {
    MapStore.addChangeListener(this._handleNext);
  },

  render: function () {
    var prompt;

    if (this.state.status === 'done') {
      prompt = "Well Done!";
    } else if (this.state.status === 'wrong') {
      prompt = "Nope!";
    } else if (this.state.model) {
      var tpl = _.template("Where Is <%= name %>?");
      prompt = tpl({name: this.state.model.name});
    }

    return (
      <div id="prompt" className={this.state.status}>
        <span>{prompt}</span>
        <Timer ref='timer' />
      </div>
    );
  }
});

module.exports = Prompt;
