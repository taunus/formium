'use strict';

var state = {
  configure: configure
};

function configure (options) {
  state.qs = options.qs;
}

module.exports = state;
