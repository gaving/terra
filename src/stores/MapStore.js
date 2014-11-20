'use strict';

var Dispatcher = require('../dispatcher/Dispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants/Constants');

var selection = new EventEmitter();

selection.addChangeListener = function (f) {
  this.on('SELECTION_MADE', f);
};

Dispatcher.register(function (data) {
  var action = data.action;
  switch (action.actionType) {
    case Constants.HANDLE_SELECTION:
      selection.emit('SELECTION_MADE', action.params);
    break;
  }

  return true;
});

module.exports = selection;
