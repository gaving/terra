/** @jsx React.DOM */

'use strict';

var React = require('react/addons');
var BackboneMixin = require('backbone-react-component');

var Leaderboard = React.createClass({
  mixins: [BackboneMixin],

  createEntry: function (entry) {
    return <li className="animate">
      <span className="name">{entry.name}</span>
      <span className="count">{entry.score}</span>
    </li>
  },

  getInitialState: function() {
    return {};
  },

  render: function () {
    return <div className="leaderboard">
      <h1><span>Leaderboard</span></h1>
      <div className="content">
        <ul>
          {this.props.collection.map(this.createEntry)}
        </ul>
      </div>
    </div>
  }
});

module.exports = Leaderboard;
