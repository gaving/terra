/** @jsx React.DOM */

'use strict';

require('setimmediate')

var React = require('react');
var $ = require('jquery');
var Terra = require('./components/Terra.js');

React.render(<Terra />, $("#map")[0]);
