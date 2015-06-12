var websocket = require('websocket-stream');
var through = require('through2');
var dom = require('domquery');

var stream = websocket('ws://' + location.host + '/');

var cat = dom('.cat')[0];

stream.pipe(through(function(state, enc, next) {
  // get current position from server
  var position = JSON.parse(state);
  console.log('position array: ', position);

  // set cat x and y coordinates based on position
  cat.setAttribute('x', position[0] + '%');
  cat.setAttribute('y', (100 - position[1]) + '%');

  next();
}));
