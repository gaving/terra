'use strict';

var Dispatcher;
var FluxDispatcher = require('flux').Dispatcher;

Dispatcher = new FluxDispatcher();
Dispatcher.handleViewAction = function (action) {
  this.dispatch({
    source: 'VIEW_ACTION',
    action: action
  });
};

module.exports = Dispatcher;
