/** @jsx React.DOM */

'use strict';

var React = require('react');

var Timer = React.createClass({
  getInitialState: function() {
    return {seconds: 0};
  },
  tick: function() {
    this.setState({seconds: this.state.seconds + 1});
  },
  componentDidMount: function() {
    this.interval = setInterval(this.tick, 1000);
  },
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },
  getTime: function() {
    return this.state.seconds;
  },
  done: function() {
    this.setState({
      'done': true
    }, function() {
      this.unmountComponent();
    }.bind(this));
  },
  render: function() {
    return (
      <div id='timer' className={this.state.done ? 'done' : ''}>{this.state.seconds}</div>
    );
  }
});

module.exports = Timer;
