'use strict';

var handleSelection, 
    Constants = require('../constants/Constants'),
    Dispatcher = require('../dispatcher/Dispatcher');

handleSelection = function (params) {
  Dispatcher.handleViewAction({
    actionType: Constants.HANDLE_SELECTION,
    params: params
  });
};

module.exports = {
  handleSelection: handleSelection
};
