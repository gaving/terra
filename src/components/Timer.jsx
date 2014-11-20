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
  render: function() {
    return (
      <div className="timer">{this.state.seconds}</div>
    );
  }
});

module.exports = Timer;
